from mimetypes import init
from types import MethodType
from flask import Flask ,render_template, session,jsonify,request,url_for,redirect
import requests
from pymongo import MongoClient
from bs4 import BeautifulSoup


#db 접속
headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
client = MongoClient('mongodb+srv://test:sparta@cluster0.gxa02vr.mongodb.net/?retryWrites=true&w=majority',tls=True,
                             tlsAllowInvalidCertificates=True)
db = client.dbsparta


app = Flask(__name__)

def log_validator(func) :
    def wrapper() :
        if "id" in session:
            return func()
        else :
            return redirect(url_for('login'))
    return wrapper

@app.route('/',endpoint="home")
@log_validator
def home():
    return render_template('index.html',words=[{'value' :'hi','favorite':False,'complete':True},{'value' :'hello','favorite':False,'complete':True},{'value' :'how','favorite':True,'complete':False},{'value' :'are','favorite':True,'complete':True},{'value' :'you','favorite':True,'complete':True}])

@app.route('/login')
def login():
    return render_template('login.html')
@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/word/add',endpoint="add")
@log_validator
def add():
    return render_template('/word/add.html')

@app.route('/word/exam',endpoint="exam")
@log_validator
def exam():
    return render_template('/word/exam.html')  

@app.route('/word/enlisted',endpoint="added_list")
@log_validator
def added_list():
    return render_template('/word/added_list.html')



    


#자동완성
@app.route("/search_word",methods=["post"])
def search_word():

    keyword = request.form['keyword']
    #크롤링
    #https://dic.daum.net/search.do?q=apple&dic=eng&search_first=Y
    if keyword.isalpha():
        try:    
            doc=[]
            data = requests.get("https://dic.daum.net/search.do?q="+keyword+"&dic=eng&search_first=Y", headers=headers)
            soup = BeautifulSoup(data.text, 'html.parser')

            #정확한 단어
            cleanword = soup.find('a',{'class','txt_cleansch'}).text
            clean_href = soup.find('a',{'class','txt_cleansch'})['href']
            clean_intend = soup.find('ul',{'class','list_search'}).text
            # print(cleanword,clean_intend,clean_href)
            doc.append({
                'word' : cleanword,
                'href' : clean_href,
                'intend' : clean_intend
            })
            #연관 검색어
            data2 = soup.select('#mArticle > div.search_cont > div:nth-child(3) > div:nth-child(3) > div')
            
            for words in data2:
                word = words.select_one('strong > a').text
                intend = words.select_one('ul').text
                href = words.select_one('strong > a')['href']

                doc.append({
                    'word' : word,
                    'intend' : intend,
                    'href' : href
                })

            return jsonify({'data':doc})
        except:
            return jsonify({'data':'검색 결과가 없습니다.'})

    else:   
        try: 
            data = requests.get("https://dic.daum.net/search.do?q="+keyword+"&dic=eng", headers=headers)
            soup = BeautifulSoup(data.text, 'html.parser')
            data = soup.select('#mArticle > div.search_cont > div:nth-child(4) > div.search_box > div')
            doc=[]
            for search in data:
                word = search.select_one('div.search_word > strong > a').text
                href = search.select_one('div.search_word > strong > a')['href']
                intend = search.select_one('ul').text
                print(word,href,intend)
                doc.append({
                    'word':word,
                    'href':href,
                    'intend':intend
                })
            return jsonify({'data':doc})
        except:   
            return jsonify({'data':'검색 결과가 없습니다.'})

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

#로그아웃
@app.route("/logout",methods=["post"])
def log_out():
    session.pop('id',None)
    return jsonify({'result':'성공!!'})

#로그인체크
@app.route("/login_check",methods=["post"])
def  login_check():
    if "id" in session:
        return jsonify({'loginData': session['id']})
    else :
        return jsonify({'loginData': 'notlogin'})

#로그인체크
@app.route("/word/login_check",methods=["post"])
def  word_login_check():
    if "id" in session:
        return jsonify({'loginData': session['id']})
    else :
        return jsonify({'loginData': 'notlogin'})

#회원가입
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
    

