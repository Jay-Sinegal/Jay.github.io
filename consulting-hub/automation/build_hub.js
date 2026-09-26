/**
 * THE EXECUTIVE CONSULTING HUB - Google Workspace builder and intake automation
 *
 * One run creates the CLIENTS_2026 folder tree, both gate forms, the lead log
 * sheet, the DOWNLOAD_LEADS spreadsheet, and the form-submit automation so
 * submissions drive the gated intake flow (client subfolder + lead log row)
 * instead of landing as emails only.
 *
 * HOW TO RUN (in your Google account):
 *   1. Drive > New > More > Google Apps Script
 *   2. Replace the default code.gs with this whole file
 *   3. Run createHub (authorize DriveApp, FormApp, SpreadsheetApp, ScriptApp)
 *   4. Run installTriggers (authorize again) - installs the on-submit triggers
 *   5. Open each created form in the Forms editor, add your voice/copy from
 *      consulting-hub/path-a|path-b markdown, set confirmations.
 *
 * RESOURCE DOWNLOAD EMAIL LIST:
 *   6. Deploy the doPost web app: Deploy > New deployment > Web app.
 *      Execute as: Me. Who has access: Anyone. Copy the /exec URL.
 *   7. Paste that URL into RESOURCE_CAPTURE_URL in src/data/site.ts so the
 *      resource library POSTs each download's email here before the PDF is
 *      delivered. Rows append to DOWNLOAD_LEADS > ResourceDownloads.
 *
 * What each submission now does automatically:
 *   - Path A intake      -> creates PATH_A_ATHLETES/<date>_<Last> folder,
 *                           appends a PathA_Intake row to the HUB_LEADS_LOG sheet
 *   - Path B risk audit  -> creates PATH_B_SCHOOLS/<date>_<School> folder,
 *                           appends a PathB_RiskAudits row to the logs sheet
 *   - Both mark the exact "signed / audit submitted" moment your gates need
 *     (no Zoom before the intake is signed; no proposal before the audit).
 *
 * The Boundary never changes: education, not representation. These artifacts
 * are the SB 389 insulation, so they are created on purpose and saved forever.
 */

var PROPS = PropertiesService.getScriptProperties();
var KEY_ROOT = "HUB_CLIENTS_ROOT_ID";
var KEY_PATH_A = "HUB_PATH_A_ID";
var KEY_PATH_B = "HUB_PATH_B_ID";
var KEY_LOGS = "HUB_LEADS_LOG_SS_ID";
var KEY_FORM_A = "HUB_INTAKE_FORM_ID";
var KEY_FORM_B = "HUB_AUDIT_FORM_ID";
var KEY_NOTIFY = "HUB_NOTIFY_EMAIL";
var KEY_DOWNLOADS = "HUB_DOWNLOADS_SS_ID";

/**
 * Step 1. Create folders, forms, and log sheet. Remembers ids for automation.
 */
function createHub() {
  var root = ensureRootFolder();
  var pathA = ensureChildFolder("PATH_A_ATHLETES", root);
  var pathB = ensureChildFolder("PATH_B_SCHOOLS", root);
  ensureChildFolder("_TEMPLATES", pathA);
  ensureChildFolder("_TEMPLATES", pathB);
  var ops = ensureChildFolder("_OPERATIONS", root);
  ["01_LeadLog", "02_PainPoints_WinningLanguage", "03_PricingSheet", "04_Yearly_Calendar"]
    .forEach(function (name) { ensureChildFolder(name, ops); });

  ensureLogsSpreadsheet();
  var downloads = ensureDownloadsSpreadsheet();

  var intake = buildIntakeForm();
  var audit = buildRiskAuditForm();

  var rootUrl = DriveApp.getFolderById(root.getId()).getUrl();
  Logger.log("HUB READY.");
  Logger.log("CLIENTS_2026: " + rootUrl);
  Logger.log("Path A Intake form: " + intake.shortenFormUrl());
  Logger.log("Path B Risk Audit form: " + audit.shortenFormUrl());
  Logger.log("DOWNLOAD_LEADS (resource emails): " + downloads.getUrl());
  Logger.log("Next: run installTriggers() to wire submission automation.");
}

/** Step 2. Wire form-submit triggers to the automation handlers. */
function installTriggers() {
  removeProjectTriggers();
  var formA = FormApp.openById(PROPS.getProperty(KEY_FORM_A));
  var formB = FormApp.openById(PROPS.getProperty(KEY_FORM_B));
  ScriptApp.newTrigger("onPathAIntake").forForm(formA).onFormSubmit().create();
  ScriptApp.newTrigger("onPathBRiskAudit").forForm(formB).onFormSubmit().create();
  Logger.log("Triggers installed. Submissions now create folders and log rows.");
}

function removeProjectTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (trig) {
    if (["onPathAIntake", "onPathBRiskAudit"].indexOf(trig.getHandlerFunction()) !== -1) {
      ScriptApp.deleteTrigger(trig);
    }
  });
}

// ------------------------------------------------------------- folders -----
function ensureRootFolder() {
  var id = PROPS.getProperty(KEY_ROOT);
  if (id) {
    try {
      return DriveApp.getFolderById(id);
    } catch (e) { /* stale id, recreate below */ }
  }
  var it = DriveApp.getRootFolder().getFoldersByName("CLIENTS_2026");
  var folder = it.hasNext() ? it.next() : DriveApp.getRootFolder().createFolder("CLIENTS_2026");
  PROPS.setProperty(KEY_ROOT, folder.getId());
  return folder;
}

function ensureChildFolder(name, parent) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

// -------------------------------------------------------------- log sheet --
function ensureLogsSpreadsheet() {
  var ss = null;
  var id = PROPS.getProperty(KEY_LOGS);
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { /* recreate below */ }
  }
  if (!ss) {
    ss = SpreadsheetApp.create("HUB_LEADS_LOG");
    PROPS.setProperty(KEY_LOGS, ss.getId());
  }
  return ss;
}

function appendLeadRow(pathName, summary, map, folderUrl) {
  var ss = ensureLogsSpreadsheet();
  var sheet = ss.getSheetByName("LeadLog") || ss.insertSheet("LeadLog");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Submitted", "Path", "Contact", "Objective", "Subfolder link"]);
  }
  var contact = map["Best contact email"] || map["AD email"] || "";
  var objective = map["What is the family hoping to achieve in this consultation?"] ||
                  map["What is the single biggest compliance question you need answered?"] || "";
  sheet.appendRow([
    new Date(),
    pathName,
    contact,
    String(objective).substring(0, 250),
    folderUrl || "",
  ]);
  var notify = PROPS.getProperty(KEY_NOTIFY);
  if (notify) {
    MailApp.sendEmail(notify, "New lead: " + pathName, summary + "\nFolder: " + (folderUrl || "n/a"));
  }
}

function saveResponseSnapshot(ss, sheetName, map) {
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  var keys = Object.keys(map);
  if (sheet.getLastRow() === 0) sheet.appendRow(keys);
  sheet.appendRow(keys.map(function (k) { return map[k] === undefined ? "" : String(map[k]); }));
}

function responseMap(e) {
  return e.response.getItemResponses().reduce(function (acc, item) {
    acc[item.getItem().getTitle()] = item.getResponse();
    return acc;
  }, {});
}

// ----------------------------------------------------- form submit hooks ----
function onPathAIntake(e) {
  var map = responseMap(e);
  var athleteName = String(map["Athlete name"] || "Unknown athlete");
  var parts = athleteName.split(" ");
  var lastName = parts[parts.length - 1] || "Athlete";
  var folder = ensureChildFolder(
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd") + "_" + lastName,
    DriveApp.getFolderById(PROPS.getProperty(KEY_PATH_A))
  );
  appendLeadRow("Path A", "Intake submitted for " + athleteName, map, folder.getUrl());
  saveResponseSnapshot(ensureLogsSpreadsheet(), "PathA_Intake", map);
}

function onPathBRiskAudit(e) {
  var map = responseMap(e);
  var school = String(map["School / district name"] || "Unknown school");
  var folder = ensureChildFolder(
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd") + "_" + folderSafe(school),
    DriveApp.getFolderById(PROPS.getProperty(KEY_PATH_B))
  );
  appendLeadRow("Path B", "Risk audit submitted for " + school, map, folder.getUrl());
  saveResponseSnapshot(ensureLogsSpreadsheet(), "PathB_RiskAudits", map);
}

function folderSafe(name) {
  return String(name).replace(/[\/\\:*?"<>|]/g, "").trim() || "School";
}

// ---------------------------------------------- resource download email list -
// Public web-app endpoint. The resource library POSTs { resource, resourceTitle,
// email, consent, ts } from each PDF download; rows land in
// DOWNLOAD_LEADS > ResourceDownloads. Deploy as Web app, Execute as Me,
// Who has access: Anyone (go-live steps in consulting-hub/GO_LIVE.md).
function ensureDownloadsSpreadsheet() {
  var ss = null;
  var id = PROPS.getProperty(KEY_DOWNLOADS);
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { /* recreate below */ }
  }
  if (!ss) {
    ss = SpreadsheetApp.create("DOWNLOAD_LEADS");
    PROPS.setProperty(KEY_DOWNLOADS, ss.getId());
  }
  return ss;
}

function resourceLeadsSheet() {
  var ss = ensureDownloadsSpreadsheet();
  var sheet = ss.getSheetByName("ResourceDownloads") || ss.insertSheet("ResourceDownloads");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Received", "Email", "Resource slug", "Resource title", "Consent", "Submitted"]);
  }
  return sheet;
}

/**
 * Optional: send download rows to a specific existing spreadsheet instead of a
 * new DOWNLOAD_LEADS sheet. Run in the Apps Script editor:
 *   setDownloadsSpreadsheetId("1Goy1jt...")   // paste any drive sheet id
 * Use the id of the sheet from GO_LIVE.md Step 7 if you already created one.
 */
function setDownloadsSpreadsheetId(id) {
  if (!id) throw new Error("id required");
  var ss = SpreadsheetApp.openById(id);
  PROPS.setProperty(KEY_DOWNLOADS, ss.getId());
  return ss.getUrl();
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");
    var email = String(body.email || "").trim().toLowerCase();
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "email required" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    resourceLeadsSheet().appendRow([
      new Date(),
      email,
      String(body.resource || ""),
      String(body.resourceTitle || ""),
      body.consent === true ? "Yes" : "No",
      String(body.ts || ""),
    ]);
    var notify = PROPS.getProperty(KEY_NOTIFY);
    if (notify) {
      MailApp.sendEmail(notify, "Resource download lead: " + email,
        "Email: " + email + "\nResource: " + String(body.resourceTitle || "") + "\nSubmitted: " + String(body.ts || ""));
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// -------------------------------------------------- gate forms (unchanged) --
function buildIntakeForm() {
  var form = FormApp.create("Athlete Brand Architecture Intake and Legal Boundary Form");
  form.setDescription(
    "Jaylen Sinegal is an executive brand strategist, media IP consultant, and official " +
    "Louisiana Storyteller. This form maps the athlete's digital footprint and sets a legal " +
    "boundary. This work is education in brand architecture and media IP. It is NOT athlete " +
    "agency, and I do NOT negotiate athletic or endorsement contracts."
  );
  form.setConfirmationMessage(
    "Form received. A follow-up arrives within one business day. Nothing you submitted here " +
    "is a contract or an agent relationship."
  );
  form.setLimitOneResponsePerUser(true);
  form.setAllowResponseEdits(false);
  form.setCollectEmail(true);

  form.addPageBreakItem().setTitle("The Athlete");
  addText(form, "Athlete name", true);
  addText(form, "Age", true);
  addDate(form, "Date of birth", true);
  addChoice(form, "Primary sport", true, ["Football", "Basketball", "Baseball", "Track", "Soccer", "Softball", "Other"]);
  addText(form, "High school (if applicable)", false);
  addText(form, "Graduation class year", false);
  addYesNo(form, "LHSAA member school?", true);

  form.addPageBreakItem().setTitle("Digital Footprint");
  addText(form, "Social media accounts (full handles: Instagram, TikTok, X, YouTube, Snapchat)", true);
  addText(form, "Total combined followers", false);
  addYesNo(form, "Does the athlete have a highlight reel posted anywhere (Hudl, YouTube, Vimeo)?", true);
  addText(form, "Link to primary highlight reel", false);
  addYesNo(form, "Have local businesses already reached out about paid posts?", true);
  addYesNo(form, "Has the family signed any NIL agreement yet?", true);
  addYesNo(form, "If yes, does the family have a copy they fully understand?", false);

  form.addPageBreakItem().setTitle("Parent / Guardian");
  addText(form, "Parent / legal guardian full name", false);
  addText(form, "Relationship to athlete", false);
  addText(form, "Parent / guardian email", false);
  addText(form, "Parent / guardian phone", false);
  addText(form, "Best contact email", true);
  addChoice(form, "How did you hear about this consultation?", true,
    ["Instagram", "Website", "Word of mouth", "Clinic", "FlightTime", "Other"]);

  form.addPageBreakItem().setTitle("Expectations");
  addText(form, "What is the family hoping to achieve in this consultation?", true);
  addText(form, "What is the athlete's biggest concern right now about their online presence?", true);
  addChoice(form, "Recruitment visibility, media IP protection, or both?", true,
    ["Recruitment visibility", "Media IP protection", "Both", "Not sure"]);
  addChoice(form, "When does this matter most?", true,
    ["Now", "This season", "By graduation", "No rush"]);

  form.addPageBreakItem().setTitle("Legal Boundary");
  addCheckbox(form, "Boundary agreement", true,
    ["I understand that Jaylen Sinegal provides media IP education and brand architecture. " +
     "He is NOT a registered athlete agent under Louisiana SB 389 and does not negotiate " +
     "athletic or endorsement contracts."]);
  addCheckbox(form, "Education scope", true,
    ["I understand this consultation is education and strategy, not legal advice. Louisiana " +
     "NIL rules (Act 810, SB 389) can change; final decisions should be reviewed with " +
     "qualified professionals."]);
  addText(form, "Electronic signature (full legal name)", true);
  addDate(form, "Date", true);

  PROPS.setProperty(KEY_FORM_A, form.getId());
  return form;
}

function buildRiskAuditForm() {
  var form = FormApp.create("Athletic Department NIL and Media Compliance Risk Audit");
  form.setDescription(
    "Act 810 governs high school NIL, parent consent, and amateur status. SB 389 (Act 895) " +
    "governs athlete agent registration with the Louisiana Attorney General. This 5-minute " +
    "audit maps where your program stands today. Completing it does not obligate your school " +
    "to anything."
  );
  form.setConfirmationMessage(
    "Audit received. I will follow up within one business day to set up a discovery call. " +
    "No obligation attached."
  );
  form.setLimitOneResponsePerUser(true);
  form.setCollectEmail(true);

  form.addPageBreakItem().setTitle("School and Contact");
  addText(form, "School / district name", true);
  addText(form, "Parish / city", true);
  addText(form, "Athletic Director name", true);
  addText(form, "AD email", true);
  addText(form, "AD phone", true);
  addText(form, "Number of varsity sports", true);
  addText(form, "Approximate total student-athletes", true);
  addText(form, "School classification", true);

  form.addPageBreakItem().setTitle("Act 810 - Consent and Policy");
  addYesNo(form, "Does your district have a written, board-approved NIL policy?", true);
  addYesNo(form, "Is there a single point of contact for NIL compliance?", true);
  addYesNo(form, "Does your process require written parent consent before a minor signs an NIL agreement?", true);
  addYesNo(form, "Do you track which athletes have submitted written consent?", true);
  addYesNo(form, "Have athletes or families asked you about NIL this year?", true);
  addYesNo(form, "Has any athlete signed an NIL agreement to your knowledge?", true);

  form.addPageBreakItem().setTitle("SB 389 - Agent Verification");
  addYesNo(form, "Have outside people contacted your athletes this year?", true);
  addYesNo(form, "Do you have a system to verify AG registration for anyone acting as an agent?", true);
  addYesNo(form, "Have you shared SB 389 awareness material with parents or coaches?", true);
  addCheckbox(form, "Labels used by people contacting athletes (select all)", true,
    ["Advisor", "Recruiting consultant", "Brand manager", "Agent", "Family friend", "No one yet"]);

  form.addPageBreakItem().setTitle("Media and Music Licensing");
  addYesNo(form, "Does your media team use commercial music in highlight reels?", true);
  addChoice(form, "Do you use cleared or licensed music?", true,
    ["Always", "Sometimes", "Never", "Not sure"]);
  addYesNo(form, "Do you know the difference between a master recording and a sync license?", true);
  addYesNo(form, "Have you received a DMCA takedown or copyright claim on a school account?", true);
  addText(form, "Who manages your athletic social media accounts?", true);

  form.addPageBreakItem().setTitle("Highlights and Footage");
  addCheckbox(form, "Where are highlight films hosted?", true,
    ["Hudl", "YouTube", "School website", "X", "Don't know"]);
  addYesNo(form, "Do athletes or families have independent access to their own film?", true);
  addYesNo(form, "Have you formalized media consent (photo/video) from parents this year?", true);
  addYesNo(form, "Does your program review platform terms before posting athlete content?", true);

  form.addPageBreakItem().setTitle("Priority");
  addScale(form, "How confident are you that your program is compliant today?");
  addChoice(form, "Where would a clinic fit best?", true,
    ["Fall in-service", "Admin day", "Coach development day", "Parent info night", "Other"]);
  addText(form, "What is the single biggest compliance question you need answered?", true);
  addChoice(form, "How soon would your school like to address this?", true,
    ["Immediately", "This season", "This year", "Researching"]);

  PROPS.setProperty(KEY_FORM_B, form.getId());
  return form;
}

function addText(form, title, required) {
  form.addTextItem().setTitle(title).setRequired(required === true);
}
function addDate(form, title, required) {
  form.addDateItem().setTitle(title).setRequired(required === true);
}
function addYesNo(form, title, required) {
  var item = form.addMultipleChoiceItem().setTitle(title).setRequired(required === true);
  item.setChoiceValues(["Yes", "No", "Not sure"]);
}
function addChoice(form, title, required, values) {
  var item = form.addListItem().setTitle(title).setRequired(required === true);
  item.setChoiceValues(values);
}
function addCheckbox(form, title, required, values) {
  var item = form.addCheckboxItem().setTitle(title).setRequired(required === true);
  item.setChoiceValues(values);
}
function addScale(form, title) {
  var item = form.addScaleItem().setTitle(title).setRequired(true);
  item.setBounds(1, 10).setLabels("Not confident", "Fully confident");
}

// Optional: set this to your email to get a one-line notification per lead.
function setNotifyEmail(email) {
  PROPS.setProperty(KEY_NOTIFY, email);
}