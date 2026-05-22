
# Load System.Drawing assemblies
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$assetsDir = "c:\Users\ilyes\Desktop\urbain app report\urban-issue-app\assets"
if (!(Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force
}

# Helper function to create water drop path
function Get-WaterDropPath {
    param(
        [float]$x,
        [float]$y,
        [float]$width,
        [float]$height
    )
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    
    # Apex at top-middle
    $apexX = $x + ($width / 2)
    $apexY = $y
    
    # Bottom circle anchors
    $bottomY = $y + $height
    $leftX = $x
    $rightX = $x + $width
    
    # Add teardrop curves
    # Go from apex down to right curve, then bottom arc, then up to apex
    $path.AddBezier($apexX, $apexY, $apexX + ($width * 0.3), $y + ($height * 0.45), $rightX, $bottomY - ($height * 0.35), $rightX, $bottomY - ($height * 0.3))
    $path.AddArc($x, $bottomY - $width, $width, $width, 0, 180)
    $path.AddBezier($leftX, $bottomY - ($height * 0.3), $leftX, $bottomY - ($height * 0.35), $apexX - ($width * 0.3), $y + ($height * 0.45), $apexX, $apexY)
    
    return $path
}

# 1. ICON (512x512, Transparent)
$iconBmp = New-Object System.Drawing.Bitmap 512, 512
$g = [System.Drawing.Graphics]::FromImage($iconBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

# Draw water drop in center
$dropPath = Get-WaterDropPath 106 50 300 350
$dropBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0x4B, 0xAA, 0xD3)) # #4BAAD3
$g.FillPath($dropBrush, $dropPath)

# Draw white wave lines in center of drop
$wavePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 6
$wavePath = New-Object System.Drawing.Drawing2D.GraphicsPath
$wavePath.AddBezier(180, 260, 210, 230, 240, 290, 270, 260)
$wavePath.AddBezier(190, 290, 220, 260, 250, 320, 280, 290)
$g.DrawPath($wavePen, $wavePath)

# Algerian flag dots (Green and Red) on the Arabic parts
$greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0x00, 0x62, 0x33)) # Flag Green
$redBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0xD2, 0x10, 0x34))   # Flag Red
$g.FillEllipse($greenBrush, 280, 150, 22, 22)
$g.FillEllipse($redBrush, 210, 160, 22, 22)

# Save Icon
$iconBmp.Save((Join-Path $assetsDir "icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$iconBmp.Dispose()


# 2. ADAPTIVE-ICON (512x512, Solid #1A5F8A background, drop centered)
$adaptiveBmp = New-Object System.Drawing.Bitmap 512, 512
$g = [System.Drawing.Graphics]::FromImage($adaptiveBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(255, 0x1A, 0x5F, 0x8A)) # #1A5F8A

# Draw water drop in center
$dropPath = Get-WaterDropPath 136 80 240 280
$dropBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0x4B, 0xAA, 0xD3))
$g.FillPath($dropBrush, $dropPath)

# Wave lines
$wavePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 5
$wavePath = New-Object System.Drawing.Drawing2D.GraphicsPath
$wavePath.AddBezier(195, 248, 219, 224, 243, 272, 267, 248)
$wavePath.AddBezier(203, 272, 227, 248, 251, 296, 275, 272)
$g.DrawPath($wavePen, $wavePath)

# Algerian flag dots
$g.FillEllipse($greenBrush, 275, 160, 18, 18)
$g.FillEllipse($redBrush, 219, 168, 18, 18)

# Save Adaptive Icon
$adaptiveBmp.Save((Join-Path $assetsDir "adaptive-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$adaptiveBmp.Dispose()


# 3. LOGO (512x512, Transparent with logo drop + typography text)
$logoBmp = New-Object System.Drawing.Bitmap 512, 512
$g = [System.Drawing.Graphics]::FromImage($logoBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

# Teardrop
$dropPath = Get-WaterDropPath 166 40 180 210
$dropBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0x1A, 0x5F, 0x8A)) # deep blue for transparent bg
$g.FillPath($dropBrush, $dropPath)

# White waves
$wavePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 4
$wavePath = New-Object System.Drawing.Drawing2D.GraphicsPath
$wavePath.AddBezier(210, 166, 228, 148, 246, 184, 264, 166)
$wavePath.AddBezier(216, 184, 234, 166, 252, 202, 270, 184)
$g.DrawPath($wavePen, $wavePath)

# Dots
$g.FillEllipse($greenBrush, 270, 100, 14, 14)
$g.FillEllipse($redBrush, 228, 106, 14, 14)

# Text elements
$fontAr = [System.Drawing.Font]::new("Arial", 22, [System.Drawing.FontStyle]::Bold)
$fontArSub = [System.Drawing.Font]::new("Arial", 16, [System.Drawing.FontStyle]::Regular)
$fontFr = [System.Drawing.Font]::new("Arial", 14, [System.Drawing.FontStyle]::Bold)

$brushText = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0x1C, 0x28, 0x33)) # Charcoal
$brushTextSub = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0x29, 0x80, 0xB9)) # Medium Blue

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center

# Draw text
$g.DrawString("الجزائرية للمياه", $fontAr, $brushText, 256, 290, $sf)
$g.DrawString("وحدة بشار", $fontArSub, $brushTextSub, 256, 345, $sf)
$g.DrawString("ADE BÉCHAR", $fontFr, $brushText, 256, 390, $sf)

# Save Logo
$logoBmp.Save((Join-Path $assetsDir "logo.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$logoBmp.Dispose()


# 4. SPLASH (1080x1920, Saharan deep blue gradient background with logo centered)
$splashBmp = New-Object System.Drawing.Bitmap 1080, 1920
$g = [System.Drawing.Graphics]::FromImage($splashBmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Draw vertical gradient background (#0D4F75 -> #1A5F8A -> #1A7DB8)
$rect = New-Object System.Drawing.Rectangle 0, 0, 1080, 1920
$cStart = [System.Drawing.Color]::FromArgb(255, 0x0D, 0x4F, 0x75) # #0D4F75
$cEnd = [System.Drawing.Color]::FromArgb(255, 0x1A, 0x7D, 0xB8)   # #1A7DB8
$gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $cStart, $cEnd, 90.0 # Vertical

$g.FillRectangle($gradBrush, $rect)

# Draw centered water drop (white/colored on dark background)
$dropPath = Get-WaterDropPath 365 550 350 420
$dropBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$g.FillPath($dropBrush, $dropPath)

# Draw blue wave lines in center of white drop
$wavePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 0x1A, 0x5F, 0x8A)), 7
$wavePath = New-Object System.Drawing.Drawing2D.GraphicsPath
$wavePath.AddBezier(450, 802, 485, 767, 520, 837, 555, 802)
$wavePath.AddBezier(461, 837, 496, 802, 531, 872, 566, 837)
$g.DrawPath($wavePen, $wavePath)

# Algerian flag dots inside the white drop
$g.FillEllipse($greenBrush, 566, 670, 24, 24)
$g.FillEllipse($redBrush, 485, 680, 24, 24)

# Draw Splash Typography text
$fontSplashAr = [System.Drawing.Font]::new("Arial", 46, [System.Drawing.FontStyle]::Bold)
$fontSplashArSub = [System.Drawing.Font]::new("Arial", 32, [System.Drawing.FontStyle]::Regular)
$fontSplashFr = [System.Drawing.Font]::new("Arial", 26, [System.Drawing.FontStyle]::Bold)

$brushSplashWhite = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$brushSplashLight = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(200, 255, 255, 255))
$brushSplashMuted = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(140, 255, 255, 255))

$g.DrawString("الجزائرية للمياه", $fontSplashAr, $brushSplashWhite, 540, 1080, $sf)
$g.DrawString("وحدة بشار", $fontSplashArSub, $brushSplashLight, 540, 1180, $sf)
$g.DrawString("ADE BÉCHAR", $fontSplashFr, $brushSplashMuted, 540, 1280, $sf)

# Draw Splash version indicator at the very bottom
$fontVersion = [System.Drawing.Font]::new("Arial", 16, [System.Drawing.FontStyle]::Regular)
$g.DrawString("وحدة بشار — الجزائرية للمياه © 2025", $fontVersion, $brushSplashMuted, 540, 1780, $sf)

# Save Splash
$splashBmp.Save((Join-Path $assetsDir "splash.png"), [System.Drawing.Imaging.ImageFormat]::Png)

# Keep a duplicate splash-icon.png if needed by app config
$splashBmp.Save((Join-Path $assetsDir "splash-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$splashBmp.Dispose()
$gradBrush.Dispose()
$greenBrush.Dispose()
$redBrush.Dispose()
$dropBrush.Dispose()
$wavePen.Dispose()
$brushSplashWhite.Dispose()
$brushSplashLight.Dispose()
$brushSplashMuted.Dispose()

Write-Host "SUCCESS: Brand assets successfully generated programmatically using System.Drawing."
