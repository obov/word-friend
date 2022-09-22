from mimetypes import init
from types import MethodType
from flask import Flask ,render_template, session,jsonify,request,url_for,redirect
import requests
from pymongo import MongoClient
from bs4 import BeautifulSoup
import hashlib
import jwt
import random

#db 접속
headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
client = MongoClient('mongodb+srv://test:sparta@cluster0.gxa02vr.mongodb.net/?retryWrites=true&w=majority',tls=True,
                             tlsAllowInvalidCertificates=True)
db = client.dbsparta


app = Flask(__name__)

SECRET_KEY = 'tkaruqtkf159159'

@app.route('/',endpoint="home")
def home():
    logindata = login_check().get_json()['loginData']
    if logindata == 'login':
        fav = [{'value' :'hi','favorite':False,'complete':True},{'value' :'hello','favorite':False,'complete':True},{'value' :'how','favorite':True,'complete':False},{'value' :'are','favorite':True,'complete':True},{'value' :'you','favorite':True,'complete':True}]
        words_for_fav = '-'.join(word['value'] for word in fav)
        recent = [{'value' :'I','favorite':False,'complete':True},{'value' :'am','favorite':False,'complete':True},{'value' :'fine','favorite':True,'complete':False},{'value' :'thank','favorite':True,'complete':True},{'value' :'you','favorite':True,'complete':True}]
        words_for_recent = '-'.join(word['value'] for word in recent)
        recap = [{'value' :'and','favorite':True,'complete':True},{'value' :'you','favorite':True,'complete':True}]
        words_for_recap = '-'.join(word['value'] for word in recap)
        return render_template('index.html',words_for_fav=words_for_fav,words_for_recent=words_for_recent,words_for_recap=words_for_recap)
    else :
        return redirect(url_for('auth'))
    
@app.route('/auth')
def auth():
    return render_template('auth.html')

@app.route('/word/add',endpoint="add")
def add():
    logindata = login_check().get_json()['loginData']
    if logindata == 'login':
        return render_template('/word/add.html')
    else :
        return redirect(url_for('auth'))
    
@app.route('/word/exam')
def exam():
    logindata = login_check().get_json()['loginData']
    if logindata == 'login':
        return render_template('/word/exam.html')
    else :
        return redirect(url_for('auth'))
    
@app.route('/word/added_list')
def added_list():
    logindata = login_check().get_json()['loginData']
    if logindata == 'login':
        return render_template('/word/added_list.html')
    else :
        return redirect(url_for('auth'))


def isEnglishOrKorean(input_s):
    k_count = 0
    e_count = 0
    for c in input_s:
        if ord('가') <= ord(c) <= ord('힣'):
            k_count+=1
        elif ord('a') <= ord(c.lower()) <= ord('z'):
            e_count+=1
    return "한국어" if k_count>e_count else "영어"


#테스트
def bs4(keyword):
    if keyword.isalpha():
        try:    
            doc=[]
            data = requests.get("https://dic.daum.net/search.do?q="+keyword+"&dic=eng&search_first=Y", headers=headers)
            soup = BeautifulSoup(data.text, 'html.parser')
            index =0
            #정확한 단어
            cleanword = soup.find('a',{'class','txt_cleansch'}).text
            clean_href = soup.find('a',{'class','txt_cleansch'})['href']
            clean_intend = soup.find('ul',{'class','list_search'}).text
            # print(cleanword,clean_intend,clean_href)
            doc.append({
                'word' : cleanword,
                'href' : clean_href,
                'intend' : clean_intend,
                'index' : index
            })
            #연관 검색어
            data2 = soup.select('#mArticle > div.search_cont > div:nth-child(3) > div:nth-child(3) > div')
            for words in data2:
                word = words.select_one('strong > a').text
                intend = words.select_one('ul').text
                href = words.select_one('strong > a')['href']
                index +=1
                doc.append({
                    'word' : word,
                    'intend' : intend,
                    'href' : href,
                    'index' : index
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
            index = 0
            for search in data:
                word = search.select_one('div.search_word > strong > a').text
                href = search.select_one('div.search_word > strong > a')['href']
                intend = search.select_one('ul').text
                index += 1
                doc.append({
                    'word':word,
                    'href':href,
                    'intend':intend,
                    'index' : index
                })
            return jsonify({'data':doc})
        except:   
            return jsonify({'data':'검색 결과가 없습니다.'})

#자동완성
@app.route("/search_word",methods=["get"])
def search_word():
    keyword = request.args.get('keyword')
    result = bs4(keyword).get_json()
    return result
   
#토큰 확인 후 db 저장
@app.route("/insert_word",methods=["post"])
def insert_word():
    keyword = request.form['formdata']
    wordindex = request.form['index']
    results = bs4(keyword).get_json()
    token = request.cookies.get('mytoken')
    
    insert_index = 0
    index_result = db.favorites.find({'token':token})
    
    if index_result is not None:
        for indexs in index_result:
            insert_index += 1


    for result in results['data']:
        if wordindex == str(result['index']):
            keyword = result['word']
            doc = {
                'token':token,
                'word':result['word'],
                'intend':result['intend'],
                'index' : insert_index
            }
            break

    result = db.favorites.find_one({'token': token,'word':keyword})
        
    if result is not None:
        return jsonify({'msg':f"이미 등록한 단어입니다!"})
    else : db.favorites.insert_one(doc)

    print(doc)
    return jsonify({'msg':f"{keyword} 저장 성공!"})

#로그인 api (jwt)
@app.route("/login",methods=["post"])
def log_in():
    input_data = request.get_json()
    id = input_data['id']
    pw = input_data['pw']
    print(id,pw)
    #암호화! -> db에 저장된 암호화된 비밀번호를 조회해야함!
    pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()
    
    #db조회
    try:
        find_result = db.users.find_one({'id': id,'pw':pw_hash})
        if find_result is not None:
            #검색 결과가 None 아니면 playload에 정보를 저장하고 토큰을 발급해서 전달 !
            playload = {
                'id' : find_result['id'],

            }

            jwt_token = jwt.encode(playload,SECRET_KEY, algorithm='HS256')
            return jsonify({'msg' : '성공!','result':'success', 'jwt_token': jwt_token})        
        else:
            return jsonify({'msg' : '비밀번호를 확인해주세요.','result':'false'})

    except:        
        return jsonify({'msg': '일치하는 계정이 없습니다.','result':'false'})



#로그인체크
@app.route("/login_check",methods=["post"])
def  login_check():
    token = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        find_result = db.users.find_one({'id': payload['id']})
        return jsonify({'loginData': 'login'})
    except jwt.ExpiredSignatureError:
        return jsonify({'loginData': 'notlogin'})
    except jwt.exceptions.DecodeError:
        return jsonify({'loginData': 'notlogin'})

#로그인체크
@app.route("/word/login_check",methods=["post"])
def  word_login_check():
    token = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        find_result = db.users.find_one({'id': payload['id']})
        return jsonify({'loginData': 'login'})
    except jwt.ExpiredSignatureError:
        return jsonify({'loginData': 'notlogin'})
    except jwt.exceptions.DecodeError:
        return jsonify({'loginData': 'notlogin'})

#회원가입
@app.route("/sign_up",methods=["post"])
def  sign_up():
    try:
        input_data = request.get_json()
        id = input_data['id']
        pw = input_data['pw']

        #암호화!
        pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()

        doc = {'id':id,'pw':pw_hash}
        db.users.insert_one(doc)

        return jsonify({'msg': '회원가입 완료! 로그인 해주세요!'})
    except:
        return jsonify({'msg': '회원가입에 실패하였습니다. 관리자에게 문의해주세요'})


#뜻 보이기
@app.route("/word/exam/show_intend", methods=["POST"])
def show_intend():
    num_receive = request.form['num_give']
    db.favorites.update_one({'num': int(num_receive)}, {'$set': {'done': 1}})
    return jsonify({'msg': '뜻 확인'})

#테스트 패스
@app.route("/word/exam/pass", methods=["POST"])
def test_pass():
    num_receive = request.form['num_give']
    db.favorites.update_one({'num': int(num_receive)}, {'$set': {'done': 0}})
    db.favorites.update_one({'num': int(num_receive)}, {'$set': {'show': 1}})
    db.favorites.update_one({'num': int(num_receive)+1}, {'$set': {'show': 0}})
    return jsonify({'msg': 'pass'})

#테스트 페일
@app.route("/word/exam/fail", methods=["POST"])
def test_fail():
    num_receive = request.form['num_give']
    db.favorites.update_one({'num': int(num_receive)}, {'$set': {'done': 0}})
    db.favorites.update_one({'num': int(num_receive)}, {'$set': {'show': 1}})
    db.favorites.update_one({'num': int(num_receive) + 1}, {'$set': {'show': 0}})
    return jsonify({'msg': 'fail'})

#시험 준비상태
@app.route("/word/eaxm_ready", methods=["POST"])
def exam_ready():

    for i in range(20):
        db.favorites.update_one({'done':1},{'$set': {'done': 0}})
        db.favorites.update_one({'show':0},{'$set': {'show': 1}})
    db.favorites.update_one({'num': 1},{'$set': {'show': 0}})


    return jsonify({'msg': '준비완료'})

#단어리스트
@app.route("/word/exam_get", methods=["GET"])
def exam_get():
    value_list = list(db.favorites.find({}, {'_id': False}))
    return jsonify({'exams': value_list})




if __name__ == '__main__':
    app.run('0.0.0.0', port=5002, debug=True)
    

