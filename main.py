
import webapp2
import os
import jinja2

template_dir = os.path.join(os.path.dirname(__file__), 'views')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), autoescape = True)
class Handler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)
        
    def render_str(self, temp, **params):
        tra = jinja_env.get_template(temp)
        return tra.render(params)
        
    def render(self, temp, **kw):
        self.write(self.render_str(temp, **kw))
        
class MainHandler(Handler):
    def get(self):
        items = range(0)
        digi = self.request.get("digi")
        if digi.isdigit():
            items = range(int(digi))
        else:
            None
        self.render("inicio.html", items = items)

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
