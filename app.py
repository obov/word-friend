from flask import Flask ,render_template
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')
@app.route('/login')
def login():
    return render_template('login.html')
@app.route('/signup')
def signup():
    return render_template('signup.html')
@app.route('/word/enlist')
def enlist():
    return render_template('/word/enlist.html')
@app.route('/word/exam')
def exam():
    return render_template('/word/exam.html')
@app.route('/word/enlisted')
def enlisted():
    return render_template('/word/enlisted.html')

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)