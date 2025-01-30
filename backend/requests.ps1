# PowerShell script to execute curl command in a loop

$url = "http://localhost:4000/submit"
$count = 30

for ($i = 1; $i -le $count; $i++) {
  Write-Host "Executing request $($i) of $count..." # Optional: Show progress

  try {
    # Use Invoke-WebRequest (PowerShell's equivalent of curl)
    # Invoke-WebRequest -Method Post -Uri $url

    curl -X POST $url

    # Or, if you have curl.exe available in your path, you can still use it:
    # curl -X POST $url

    Write-Host "Request $($i) completed successfully." # Optional: Confirmation
  }
  catch {
    Write-Error "Error during request $($i): $_" # Handle errors
  }

  # Optional: Add a delay between requests (e.g., 1 second)
  # Start-Sleep -Seconds 1 
}

Write-Host "Finished executing $count requests."