
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
        # chamando a pagina e passando uma variavel chamda titulo para o arquivo em html
        self.render("inicio.html", titulo = "Estruturas de Dados Animadas")

class SequencialHandler(Handler):
    def get(self):
        self.render("listaSequencial.html", titulo = "TAD's - Lista Sequencial")

class Encadeada1Handler(Handler):
    def get(self):
        self.render("listaEncadeada1.html", titulo = "TAD's - Lista Simplesmente Encadeada")

class PilhaHandler(Handler):
    def get(self):
        self.render("pilha.html", titulo = "TAD's - Pilha")

class FilaHandler(Handler):
    def get(self):
        self.render("fila.html", titulo = "TAD's - Fila")

class ArvoreHandler(Handler):
    def get(self):
        self.render("arvore.html", titulo = "TAD's - Arvore")

class AVLHandler(Handler):
    def get(self):
        self.render("avl.html", titulo = "TAD's - AVL")

class TesteHandler(Handler):
    def get(self):
        pass

    def post (self):
        pass    

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/listaSequencial', SequencialHandler),
    ('/listaSimplesmenteEncadeada', Encadeada1Handler),
    ('/pilha', PilhaHandler),
    ('/fila', FilaHandler),
    ('/arvore', ArvoreHandler),
    ('/avl', AVLHandler),
    ('/teste', TesteHandler)
], debug=True)
