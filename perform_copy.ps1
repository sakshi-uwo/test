$root = "d:\REALITY OS"
$target = "$root\Reality_Unified"

# Create target directories
New-Item -ItemType Directory -Force -Path "$target\frontend" | Out-Null
New-Item -ItemType Directory -Force -Path "$target\backend" | Out-Null

# Copy Frontend
Write-Host "Copying Frontend..."
robocopy "$root\REALITY" "$target\frontend" /E /XD node_modules .git /NFL /NDL /NJH /NJS
if ($LASTEXITCODE -ge 8) { Write-Error "Robocopy frontend failed"; exit 1 }

# Copy Backend
Write-Host "Copying Backend..."
robocopy "$root\backend" "$target\backend" /E /XD node_modules .git /NFL /NDL /NJH /NJS
if ($LASTEXITCODE -ge 8) { Write-Error "Robocopy backend failed"; exit 1 }

# Try to swap folders if possible
Try {
    Rename-Item -Path "$root\REALITY" -NewName "REALITY_OLD" -ErrorAction Stop
    Rename-Item -Path "$target" -NewName "REALITY"
    Write-Host "SUCCESS: Folders swapped. 'REALITY' now contains the unified project."
} Catch {
    Write-Warning "Could not rename original 'REALITY' folder (likely locked)."
    Write-Host "Unified project created at: $target"
    Write-Host "Please use '$target' from now on."
}
