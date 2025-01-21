function processFormResponses() {
  try {
    // Specify the Google Sheets linked to the forms
    var sheetIds = [
      "12j9XBAo8AXo7ofrB5Cbeu1jQ2mP3SFtqQ-c6kU4d27s", // mnt 
      "1liZlUD7WW9F1l-6lBJQ5Bb4VZfWVNzZMZb7D0qpKqIQ", // mecanica
      "187dNnLrPZxT5eDyxnOvGuyr67nAPZXIb4rgMZuX0Uhc"  // eletronica
    ];

    // Specify the parent folder in the shared drive
    var sharedDriveFolderName = "CVs";
    var sharedDriveFolders = DriveApp.getFoldersByName(sharedDriveFolderName);
    var parentFolder = sharedDriveFolders.hasNext() ? sharedDriveFolders.next() : DriveApp.createFolder(sharedDriveFolderName);

    // Use ScriptProperties to track processed timestamps
    var scriptProperties = PropertiesService.getScriptProperties();

    // Loop through each sheet ID
    for (var sheetIndex = 0; sheetIndex < sheetIds.length; sheetIndex++) {
      var sheetId = sheetIds[sheetIndex];
      var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0]; // Assuming you want the first sheet
      Logger.log("Processing sheet: " + sheet.getName());

      // Get all responses from the sheet
      var responses = sheet.getDataRange().getValues(); // Includes headers

      if (responses) {
        Logger.log("Responses found for sheet: " + sheet.getName());
      } else {
        Logger.log("Erro ao obter respostas para a folha: " + sheet.getName());
        continue; // Skip to the next sheet if no responses are found
      }

      for (var i = 1; i < responses.length; i++) {
        var row = responses[i];
        var timestamp = row[0];
        var studentName = row[1];
        var fullName = row[2];
        var email = row[3]; 
        var uploadedFileUrl = row[7];

        // Skip processed rows or rows without file upload
        if (scriptProperties.getProperty(timestamp) || !uploadedFileUrl) {
          continue;
        }

        try {
          // Create a folder named after the full name or other identifier
          var folderName = "CV" + fullName;
          var folders = parentFolder.getFoldersByName(folderName);
          var folder = folders.hasNext() ? folders.next() : parentFolder.createFolder(folderName);

          // Retrieve the uploaded file by its URL
          var uploadedFileId = getFileIdFromUrl(uploadedFileUrl); // Adiciona esta linha para extrair o ID do ficheiro
          if (uploadedFileId) {
              try {
                  var uploadedFile = DriveApp.getFileById(uploadedFileId);
                  folder.addFile(uploadedFile);
                  Logger.log("File successfully added to folder: " + folderName);
              } catch (fileAccessError) {
                  Logger.log("Error accessing or adding file with ID " + uploadedFileId + ": " + fileAccessError.toString());
              }
          } else {
              Logger.log("No valid file ID found in URL: " + uploadedFileUrl);
          }

          // Set sharing permissions
          folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
          var folderUrl = folder.getUrl();

          // Send a confirmation email
          GmailApp.sendEmail(email, "Partilha de CV", 
            "Caro " + studentName + ",\n\n" + 
            "O teu CV foi adicionado à nossa coleção e pode agora ser consultado pelos nossos patrocinadores.\n\n" + 
            "Caso o queiras consultar ou submeter uma nova versão, podes fazê-lo nesta pasta: " + folderUrl + "\n\n" + 
            "Cumprimentos,\nFSUMinho");

          Logger.log("Folder created and email sent for: " + fullName);

          // Mark the submission as processed by storing its timestamp
          scriptProperties.setProperty(timestamp, "processed");
        } catch (fileError) {
          Logger.log("Error processing file for row " + (i + 1) + ": " + fileError.toString());
        }
      }
    }
  } catch (error) {
    Logger.log("Error: " + error.toString());
  }
}

/**
 * Helper function to extract the file ID from a Google Drive URL.
 */
function getFileIdFromUrl(url) {
  // Verifica dois formatos: /d/<ID> ou ?id=<ID>
  var match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
  Logger.log("Extracted File ID: " + (match ? match[1] : "No match found for URL: " + url));
  return match ? match[1] : null;
}
