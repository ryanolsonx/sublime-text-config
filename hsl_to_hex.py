import colorsys
import re
import sublime
import sublime_plugin


class HslToHexCommand(sublime_plugin.TextCommand):
  def run(self, edit):
    for region in self.view.sel():
      hsl = self.view.substr(region)
      
      m = re.match("hsl\((\d*), (\d*)%, (\d*)%\)", hsl);
      if m:
        h, s, l = [int(g) for g in m.groups()]

        h /= 360
        s /= 100
        l /= 100

        r, g, b = colorsys.hls_to_rgb(h, l, s)

        def f(n):
          return hex(round(n * 255))[2:].zfill(2)

        hx = f"#{f(r)}{f(g)}{f(b)}"
        
        self.view.replace(edit, region, hx)
