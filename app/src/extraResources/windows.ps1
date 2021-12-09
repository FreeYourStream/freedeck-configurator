$code = @'
  [DllImport("user32.dll")]
  public static extern IntPtr GetForegroundWindow();
'@
Add-Type $code -Name Utils -Namespace Win32

Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  public class UserWindows {
    [DllImport("user32.dll")]
    public static extern IntPtr GetWindowText(IntPtr hWnd, System.Text.StringBuilder text, int count);
}
"@

while(1) {
  $hwnd = [Win32.Utils]::GetForegroundWindow()
  $stringbuilder = New-Object System.Text.StringBuilder 256
  $count = [UserWindows]::GetWindowText($hwnd, $stringbuilder, 256)

  if (0 -lt $count) {
      "$($_.ProcessName) $($stringbuilder.ToString())"
  }
  Start-Sleep -Milliseconds 100
}
