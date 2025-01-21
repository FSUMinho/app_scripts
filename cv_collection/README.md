# CV collection

## About

This script automates the collection of CVs within our organization, streamlining the process of sharing them with sponsors. Individuals can send an email following a specific format, and the script will automatically create a dedicated folder in Google Drive to store the submitted CV. Additionally, the folder is shared with the sender, granting them the ability to update its contents at any time.

## Overview of Functionality

1. **Prevent Duplicate Processing**: 
   - Creates or retrieves a Gmail label named `Processed`.
   - Ensures emails are processed only once by skipping threads already labeled as `Processed`.

2. **Organize Attachments**:
   - Creates a parent folder in Google Drive named "CVs" (if it doesn't already exist).
   - For emails with matching subjects (e.g., `CVPG1234`, `CVAG1234`), creates subfolders named after the subject.

3. **Store Attachments**:
   - Downloads email attachments into the corresponding subfolder in Google Drive.
   - Sets the folder's sharing permissions to "Anyone with the link" and grants edit rights.

4. **Reply to the Sender**:
   - Replies to the sender with a shareable link to the created folder.
   - Uses the email subject to personalize the response.

5. **Error Handling**:
   - Wraps the logic in a `try-catch` block to handle errors gracefully and log them.
