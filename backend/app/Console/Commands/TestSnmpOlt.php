<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Onu;
use App\Models\OnuSignalLog;
use Carbon\Carbon;

class TestSnmpOlt extends Command
{
    // Nama command dan parameter IP serta Community
    protected $signature = 'snmp:pull-olt {ip} {community=public}';
    protected $description = 'Tarik data redaman ONU dari OLT dan simpan ke database GIS';

    public function handle()
    {
        $ip = $this->argument('ip');
        $community = $this->argument('community');

        $this->info("Memulai proses tarik data SNMP dari OLT {$ip}...");

        // KODE SAKTI: Paksa PHP membalas OID dalam format angka murni (bukan teks MIB)
        snmp_set_oid_numeric_print(true);

        // OID berdasarkan hasil scan HA7304
        $macOid = ".1.3.6.1.4.1.25355.3.2.6.3.2.1.11.1.1";
        $rxPowerOid = ".1.3.6.1.4.1.25355.3.2.6.14.2.1.8.1.1";

        // Tarik data dengan timeout 5 detik dan maksimal 3x retries
        $macResults = @snmp2_real_walk($ip, $community, $macOid, 5000000, 3);
        $rxResults = @snmp2_real_walk($ip, $community, $rxPowerOid, 5000000, 3);


        if (!$macResults || !$rxResults) {
            $this->error("Gagal menarik data SNMP! Pastikan IP/Community benar dan OLT bisa di-ping dari dalam Docker.");
            return;
        }

        $logCount = 0;
        $now = Carbon::now();

        foreach ($macResults as $oid => $macValue) {
            // Ambil index terakhir dari OID
            $oidParts = explode('.', $oid);
            $index = end($oidParts);

            // Bersihkan format string bawaan SNMP dari MAC Address
            $macClean = trim(str_replace(['STRING:', '"', ' '], '', $macValue));

            // Cocokkan index OID MAC dengan index OID Rx Power
            // Kunci jawaban: Sesuaikan awalan dengan 'iso.' murni dari balasan server
            $rxOidKey = "iso.3.6.1.4.1.25355.3.2.6.14.2.1.8.1.1." . $index;
            $rxPowerClean = "na";

            // Cek apakah data Rx Power untuk index ini tersedia
            if (isset($rxResults[$rxOidKey])) {
                // Bersihkan juga nilai redamannya dari teks bawaan SNMP (seperti INTEGER: atau STRING:)
                $rxPowerClean = trim(str_replace(['STRING:', 'INTEGER:', '"', ' '], '', $rxResults[$rxOidKey]));
            }
            
            // Hanya proses ONU yang sedang online (redaman tidak "na")
            if(strtolower($rxPowerClean) !== "na" && is_numeric($rxPowerClean)) {
                
                // Terkadang nilai Rx Power dari OLT HA7304 harus dibagi 10, pastikan sesuai dengan OLT kamu
                // Jika OLT ngirim "-250" padahal aslinya "-25.0", ganti baris bawah jadi: $powerFloat = (float) $rxPowerClean / 10;
                $powerFloat = (float) $rxPowerClean;
                $status = $this->checkStatus($powerFloat);

                // 1. Cek apakah MAC Address ini sudah terdaftar sebagai pelanggan di tabel onus
                $onu = Onu::where('mac_address', $macClean)->first();

                if ($onu) {
                    // 2. Jika pelanggan ditemukan, simpan riwayat redamannya
                    OnuSignalLog::create([
                        'onu_id' => $onu->id,
                        'rx_power' => $powerFloat,
                        'status' => $status,
                        'created_at' => $now,
                        'updated_at' => $now
                    ]);

                    // (Opsional) Update snmp_index di tabel pelanggan jika ada pergeseran port di OLT
                    if ($onu->snmp_index != $index) {
                        $onu->update(['snmp_index' => $index]);
                    }

                    $logCount++;
                }
            }
        }

        $this->info("Selesai! Berhasil menyimpan {$logCount} data redaman ke database.");
    }

    private function checkStatus($power) {
        if ($power < -27) return 'Critical';
        if ($power < -25) return 'Warning';
        return 'Normal';
    }
}