using System;
using System.Drawing;
using System.Drawing.Imaging;

class Program {
    static void Main() {
        var inputPath  = @"public\moria-logo.jpeg";
        var outputPath = @"artifacts\moria-auto-eletrica\public\moria-logo-clean.png";

        using var src = new Bitmap(inputPath);
        var result = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb);

        // Sample background from corner
        var bgColor = src.GetPixel(2, 2);
        Console.WriteLine($"BG colour: R={bgColor.R} G={bgColor.G} B={bgColor.B}");

        // Two-pass approach:
        // Pass 1 - BFS from border (removes outer background, preserves interior)
        // Pass 2 - global color-distance removes interior pockets

        bool[,] isBg = new bool[src.Width, src.Height];

        // ----- PASS 1: BFS from border -----
        double bfsThresh = 48.0;
        var queue = new System.Collections.Generic.Queue<(int,int)>();

        void enqueue(int x, int y) {
            if (x < 0 || y < 0 || x >= src.Width || y >= src.Height) return;
            if (isBg[x, y]) return;
            var px = src.GetPixel(x, y);
            double d = Math.Sqrt(
                Math.Pow(px.R - bgColor.R, 2) +
                Math.Pow(px.G - bgColor.G, 2) +
                Math.Pow(px.B - bgColor.B, 2));
            if (d < bfsThresh) { isBg[x, y] = true; queue.Enqueue((x, y)); }
        }

        for (int x = 0; x < src.Width; x++)  { enqueue(x, 0); enqueue(x, src.Height-1); }
        for (int y = 0; y < src.Height; y++) { enqueue(0, y); enqueue(src.Width-1, y); }

        int[] dx = {1,-1,0,0};
        int[] dy = {0,0,1,-1};
        while (queue.Count > 0) {
            var (cx, cy) = queue.Dequeue();
            for (int i = 0; i < 4; i++) enqueue(cx+dx[i], cy+dy[i]);
        }

        // ----- PASS 2: global color-distance for enclosed pockets -----
        // Higher threshold to catch interior blue areas (wheel, letter holes)
        double globalThresh = 55.0;

        for (int y = 0; y < src.Height; y++)
        {
            for (int x = 0; x < src.Width; x++)
            {
                var px = src.GetPixel(x, y);
                double dist = Math.Sqrt(
                    Math.Pow(px.R - bgColor.R, 2) +
                    Math.Pow(px.G - bgColor.G, 2) +
                    Math.Pow(px.B - bgColor.B, 2));

                if (isBg[x, y] || dist < globalThresh)
                    result.SetPixel(x, y, Color.Transparent);
                else
                    result.SetPixel(x, y, px);
            }
        }

        result.Save(outputPath, ImageFormat.Png);
        Console.WriteLine("Done → " + outputPath);
    }
}
