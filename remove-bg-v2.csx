// Remove background using global color-distance (removes enclosed regions too)
// Run with: dotnet-script remove-bg-v2.csx
using System;
using System.Drawing;
using System.Drawing.Imaging;

var inputPath  = @"public\moria-logo.jpeg";
var outputPath = @"artifacts\moria-auto-eletrica\public\moria-logo-clean.png";

using var src = new Bitmap(inputPath);
var result = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb);

// Sampled background colour (navy-blue corner pixels)
// We'll sample the top-left corner to get the exact colour
var bgColor = src.GetPixel(2, 2);
Console.WriteLine($"Background sample colour: R={bgColor.R} G={bgColor.G} B={bgColor.B}");

// Threshold for "close enough to background"
double threshold = 52.0;

for (int y = 0; y < src.Height; y++)
{
    for (int x = 0; x < src.Width; x++)
    {
        var px = src.GetPixel(x, y);
        double dist = Math.Sqrt(
            Math.Pow(px.R - bgColor.R, 2) +
            Math.Pow(px.G - bgColor.G, 2) +
            Math.Pow(px.B - bgColor.B, 2));

        if (dist < threshold)
        {
            // Make transparent
            result.SetPixel(x, y, Color.Transparent);
        }
        else
        {
            result.SetPixel(x, y, px);
        }
    }
}

result.Save(outputPath, ImageFormat.Png);
Console.WriteLine($"Saved to {outputPath}");
