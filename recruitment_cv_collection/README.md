# Recruitment CV collection

## About

This script serves as a suplement to the FSUMinh CV collection. It focous on collection CV from recruitment forms and share them in our collection. It does the same thing as the `cv_collection` script. The only difference is the source of the CVs.

### Overview of Functionality

- Extracts form responses from specified Google Sheets.
- Creates a folder for each CV submission in a shared Google Drive directory.
- Shares the folder with the CV's owner, granting them edit permissions to update their submission.
- Sends a confirmation email to the submitter with a link to their folder.

## Configuration

This script requires the google sheets file ID where the form responses are beeing stored in order to extract the data. Multiple sheets files can be used. 

You can extract the ID from the google sheets link:

```
Full link
https://docs.google.com/spreadsheets/d/187dNnLrPZxT5eDyxnOvGuyr67nAPZXIb4rgMZuX0Uhc/edit?gid=905334468#gid=905334468

ID
187dNnLrPZxT5eDyxnOvGuyr67nAPZXIb4rgMZuX0Uhc
```

The IDs should be added in the `sheetsIds` var:

```
var sheetIds = [
      "12j9XBAo8AXo7ofrB5Cbeu1jQ2mP3SFtqQ-c6kU4d27s", // sheet 1
      "1liZlUD7WW9F1l-6lBJQ5Bb4VZfWVNzZMZb7D0qpKqIQ", // sheet 2
      "187dNnLrPZxT5eDyxnOvGuyr67nAPZXIb4rgMZuX0Uhc"  // sheet 3
    ];
```