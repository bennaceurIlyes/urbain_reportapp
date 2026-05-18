$projectPath = "C:\Users\ilyes\Desktop\urbain app report\urban-issue-app"
$driveLetter = "X:"

# Check if X: is already in use and remove it if it points somewhere else
if (Test-Path "$driveLetter\") {
    subst $driveLetter /D
}

Write-Host "Creating temporary drive $driveLetter to bypass Windows path space bugs..."
subst $driveLetter $projectPath

Write-Host "Clearing broken caches..."
Remove-Item -Recurse -Force "$driveLetter\android\.gradle" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$driveLetter\android\app\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$driveLetter\node_modules\react-native-reanimated\android\.cxx" -ErrorAction SilentlyContinue

Write-Host "Starting build from $driveLetter\android..."
Set-Location "$driveLetter\android"

# Run the build
.\gradlew assembleRelease

Write-Host "Cleaning up temporary drive..."
Set-Location "C:\"
subst $driveLetter /D

Write-Host "Build script finished!"
