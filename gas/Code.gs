const SHEET_NAME = 'Links';

function doGet(e) {
  const action = (e.parameter.action || '').toLowerCase();
  if (action === 'create') return json_(createLink_(e.parameter.url || '', e.parameter.alias || ''));
  if (action === 'resolve') return json_(resolveLink_(e.parameter.code || ''));
  if (action === 'stats') return json_(stats_());
  return json_({ok:true,service:'SortLink API',version:'1.0'});
}

function setup_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(['code','url','created_at','clicks','status']);
}

function createLink_(url, alias) {
  if (!/^https?:\/\//i.test(url)) return {ok:false,error:'URL harus diawali http:// atau https://.'};
  setup_();
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sh.getDataRange().getValues();
  let code = (alias || '').trim().replace(/[^A-Za-z0-9_-]/g,'').slice(0,32);
  if (code && values.some((r,i)=>i>0 && String(r[0]).toLowerCase()===code.toLowerCase())) return {ok:false,error:'Alias sudah digunakan.'};
  if (!code) {
    do { code=randomCode_(7); } while(values.some((r,i)=>i>0 && String(r[0])===code));
  }
  sh.appendRow([code,url,new Date(),0,'active']);
  return {ok:true,code:code,shortUrl:'https://msukri89.github.io/sortlink/'+encodeURIComponent(code)};
}

function resolveLink_(code) {
  setup_();
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sh.getDataRange().getValues();
  for (let i=1;i<values.length;i++) {
    if (String(values[i][0])===String(code) && String(values[i][4]||'active')==='active') {
      sh.getRange(i+1,4).setValue(Number(values[i][3]||0)+1);
      return {ok:true,url:String(values[i][1])};
    }
  }
  return {ok:false,error:'Link tidak ditemukan.'};
}

function stats_() {
  setup_();
  const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  return {ok:true,links:Math.max(0,sh.getLastRow()-1)};
}

function randomCode_(n) {
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let out='';
  for(let i=0;i<n;i++) out+=chars.charAt(Math.floor(Math.random()*chars.length));
  return out;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
