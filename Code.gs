// ==========================================
// FILE: Code.gs (BACKEND - ULTIMATE VERSION)
// ==========================================

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('E-Voting App')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ================= GLOBAL DATA =================
function getInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Get Settings
  const sheetSet = ss.getSheetByName('Pengaturan');
  const dataSet = sheetSet ? sheetSet.getDataRange().getValues() : [];
  let settings = { NamaWeb: 'E-Voting Pemilu', LogoURL: '' };
  dataSet.forEach(row => { if(row[0]) settings[row[0]] = row[1]; });

  // 2. Get Paslon
  const sheetPaslon = ss.getSheetByName('Data_Paslon');
  const dataPaslon = sheetPaslon.getDataRange().getValues();
  let paslon = [];
  for (let i = 1; i < dataPaslon.length; i++) {
    paslon.push({ id: dataPaslon[i][0], tipe: dataPaslon[i][1], nomor: dataPaslon[i][2], nama: dataPaslon[i][3], visi: dataPaslon[i][4], foto: dataPaslon[i][5] });
  }

  return { settings: settings, paslon: paslon };
}

// ================= VOTING LOGIC =================
function verifikasiNIS(nisStr) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data_Siswa');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(nisStr)) {
      if (data[i][2] === 'Sudah Memilih') return { status: 'voted', pesan: 'Anda sudah menggunakan hak suara!' };
      return { status: 'ok', nama: data[i][1], nis: data[i][0], rowIndex: i + 1 };
    }
  }
  return { status: 'not_found', pesan: 'NIS tidak terdaftar dalam DPT.' };
}

function simpanSuara(nis, rowIndex, pilihanOSIS, pilihanMPK) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheetByName('Data_Siswa').getRange(rowIndex, 3).setValue('Sudah Memilih');
  ss.getSheetByName('Log_Suara').appendRow([new Date(), nis, pilihanOSIS, pilihanMPK]);
  return { status: 'success' };
}

function getRealCount() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logData = ss.getSheetByName('Log_Suara').getDataRange().getValues();
  const siswaData = ss.getSheetByName('Data_Siswa').getDataRange().getValues();
  
  let totalSiswa = Math.max(0, siswaData.length - 1); 
  let suaraMasuk = Math.max(0, logData.length - 1);
  let hasilOSIS = {}, hasilMPK = {};
  
  for (let i = 1; i < logData.length; i++) {
    let o = logData[i][2], m = logData[i][3];
    hasilOSIS[o] = (hasilOSIS[o] || 0) + 1;
    hasilMPK[m] = (hasilMPK[m] || 0) + 1;
  }
  return { totalPemilih: totalSiswa, suaraMasuk: suaraMasuk, osis: hasilOSIS, mpk: hasilMPK };
}

// ================= ADMIN LOGIC =================
function verifikasiAdmin(username, password) {
  if (username === 'admin' && password === 'admin123') return { status: 'ok' };
  return { status: 'error', pesan: 'Username/Password salah!' };
}

// CRUD SISWA
function getSiswaData() {
  const data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data_Siswa').getDataRange().getValues();
  let siswa = [];
  // Mulai dari baris ke-2 (index 1) untuk melewati Header
  for(let i = 1; i < data.length; i++) { 
    siswa.push({ 
      nis: data[i][0], 
      nama: data[i][1], 
      kelas: data[i][2] || '-', // Mengambil data kelas dari Kolom C
      status: data[i][3] || 'Belum Memilih' // Status bergeser ke Kolom D
    }); 
  }
  return siswa;
}

function simpanSiswa(nisLama, nisBaru, nama, kelas) { // Tambah parameter 'kelas'
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data_Siswa');
  if(nisLama) { // Proses Edit Data
    const data = sheet.getDataRange().getValues();
    for(let i = 1; i < data.length; i++) {
      if(String(data[i][0]) === String(nisLama)) {
        // Update 3 kolom sekaligus (NIS, Nama, Kelas)
        sheet.getRange(i+1, 1, 1, 3).setValues([[nisBaru, nama, kelas]]);
        return {status:'ok'};
      }
    }
  } else { // Proses Tambah Data Baru
    // AppendRow sesuai urutan kolom: [A, B, C, D]
    sheet.appendRow([nisBaru, nama, kelas, 'Belum Memilih']);
    return {status:'ok'};
  }
}

function hapusSiswa(nis) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data_Siswa');
  const data = sheet.getDataRange().getValues();
  for(let i = 1; i < data.length; i++) {
    if(String(data[i][0]) === String(nis)) { 
      sheet.deleteRow(i+1); 
      return {status:'ok'}; 
    }
  }
}

// CRUD PASLON
function simpanPaslon(idLama, id, tipe, nomor, nama, visi, foto) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data_Paslon');
  if(idLama) {
    const data = sheet.getDataRange().getValues();
    for(let i=1; i<data.length; i++) {
      if(String(data[i][0]) === String(idLama)) {
        sheet.getRange(i+1, 1, 1, 6).setValues([[id, tipe, nomor, nama, visi, foto]]);
        return {status:'ok'};
      }
    }
  } else {
    sheet.appendRow([id, tipe, nomor, nama, visi, foto]);
    return {status:'ok'};
  }
}

function hapusPaslon(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data_Paslon');
  const data = sheet.getDataRange().getValues();
  for(let i=1; i<data.length; i++) {
    if(String(data[i][0]) === String(id)) { sheet.deleteRow(i+1); return {status:'ok'}; }
  }
}

// SETTINGS
function saveSettings(namaWeb, logoUrl) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Pengaturan');
  sheet.getRange(1, 2).setValue(namaWeb);
  sheet.getRange(2, 2).setValue(logoUrl);
  return {status:'ok'};
}
