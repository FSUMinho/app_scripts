function processEmails() {
  try {
    // Specify the label for processed emails to avoid duplicates
    var processedLabel = GmailApp.getUserLabelByName("Processed") || GmailApp.createLabel("Processed");

    // Specify the parent folder where CV folders will be created
    var parentFolderName = "CVs";
    var parentFolders = DriveApp.getFoldersByName(parentFolderName);
    var parentFolder = parentFolders.hasNext() ? parentFolders.next() : DriveApp.createFolder(parentFolderName);

    // Broaden the search for all unread emails
    var threads = GmailApp.search('is:unread');
    Logger.log("Found " + threads.length + " unread threads");

    threads.forEach(function(thread) {
      var messages = thread.getMessages();
      
      // Check if the thread is already processed
      if (thread.getLabels().some(label => label.getName() === processedLabel.getName())) {
        Logger.log("Skipping already processed thread: " + thread.getFirstMessageSubject());
        return; // Skip already processed threads
      }
      
      messages.forEach(function(message) {
        // Log the subject of each unread email
        Logger.log("Found unread email with subject: " + message.getSubject());
        
        var subject = message.getSubject();
        var match = subject.match(/^CV(A|PG)\d+$/);

        if (match) {
          var folderName = match[0];
          Logger.log("Matched folder name: " + folderName);
          var folders = parentFolder.getFoldersByName(folderName);
          var folder = folders.hasNext() ? folders.next() : parentFolder.createFolder(folderName);

          // Save attachments
          var attachments = message.getAttachments();
          attachments.forEach(function(attachment) {
            folder.createFile(attachment);
          });

          // Generate a shareable link to the folder with edit permission
          folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
          var folderUrl = folder.getUrl();

          // Reply to the email with the link to the created folder
          var recipient = message.getFrom();
          var replySubject = "Access to Your CV Folder: " + folderName;
          var replyBody = "Hello,\n\nYour CV has been received and processed.\nYou can access your folder using the following link: " + 
                          folderUrl + 
                          "\nYou have edit permissions to manage the contents of this folder." +
                          "\nBest regards,\nFSUMinho";
          GmailApp.sendEmail(recipient, replySubject, replyBody);

          // Mark the thread as processed
          thread.addLabel(processedLabel);
          Logger.log("Marked thread as processed and replied to: " + recipient);
        } else {
          Logger.log("No match for subject: " + subject);
        }
      });
    });
  } catch (error) {
    Logger.log("Error: " + error.toString());
  }
}
