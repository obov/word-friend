from types import MethodType
from flask import Flask ,render_template, session,jsonify,request
import requests
from pymongo import MongoClient


#db 접속
headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
client = MongoClient('mongodb+srv://test:sparta@cluster0.gxa02vr.mongodb.net/?retryWrites=true&w=majority',tls=True,
                             tlsAllowInvalidCertificates=True)
db = client.dbsparta


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
@app.route('/word/add')
def add():
    return render_template('/word/add.html')
@app.route('/word/exam')
def exam():
    return render_template('/word/exam.html')
@app.route('/word/enlisted')
def enlisted():
    return render_template('/word/enlisted.html')

#로그인 api (session)
@app.route("/login",methods=["post"])
def log_in():
    input_data = request.get_json()
    id = input_data['id']
    pw = str(input_data['pw'])
    
    #db조회
    try:
        user = db.users.find_one({'id': id})
        user_id = user['id']
        
        if id == user['id'] and pw == user['pw']:
            session['id'] = id
            return jsonify({'msg' : '성공!','result':'success'})
            
        else:
            return jsonify({'msg' : '비밀번호를 확인해주세요.','result':'false'})

    except:        
        return jsonify({'msg': '일치하는 계정이 없습니다.','result':'false'})


@app.route("/logout",methods=["post"])
def log_out():
    session.pop('id',None)
    return jsonify({'result':'성공!!'})


@app.route("/login_check",methods=["post"])
def  login_check():
    if "id" in session:
        return jsonify({'loginData': session['id']})
    else :
        return jsonify({'loginData': 'notlogin'})


@app.route("/sign_up",methods=["post"])
def  sign_up():
    try:
        input_data = request.get_json()
        doc = {'id':input_data['id'],'pw':input_data['pw']}
        db.users.insert_one(doc)
        return jsonify({'msg': '회원가입 완료! 로그인 해주세요!'})
    except:
        return jsonify({'msg': '회원가입에 실패하였습니다. 관리자에게 문의해주세요'})

if __name__ == '__main__':
    app.secret_key = 'super secret key'
    app.debug=True
    app.run('0.0.0.0', port=5001, debug=True)
    

