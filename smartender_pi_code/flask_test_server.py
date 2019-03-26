#handle a POST request
from flask import Flask, render_template, request, url_for, jsonify
from threading import Lock, Thread
from time import sleep

app = Flask(__name__)

global drinks
global in_use
global lock

@app.route('/test', methods=['POST'])
def demo_test():
    input_json = request.get_json(force=True)
    message = input_json['message']
    Thread(target=display_on_lcd, args=(message,)).start()
    print(message)
    dictToReturn = {'displayed':True}
    return jsonify(dictToReturn)

@app.route('/', methods=['GET'])
def welcome():
    return render_template('WelcomePage.html')

@app.route('/inventory', methods=['GET', 'PUT'])
def inventory():
    global drinks
    if request.method == 'PUT':
        input_json = request.get_json(force=True)
        drinks = input_json['drinks']
    dictToReturn = {'drinks':drinks}
    return jsonify(dictToReturn)

@app.route('/order', methods=['POST'])
def order():
    global drinks
    
    if in_use == False:
        global lock
        global in_use
        
        lock.acquire()
        in_use = True
        lock.release()
        input_json = request.get_json(force=True)
        name = input_json['username']
        order = input_json['order']
        
        if len(order) > 0:
            update_inventory(order)
            Thread(target=pour_drinks, args=(name, order,)).start()
            
        dictToReturn = {'busy':False,'drinks':drinks}
    
    else:
        dictToReturn = {'busy':True,'drinks':drinks}
    return jsonify(dictToReturn)

def display_on_lcd(message):
    print(message)
    
def update_inventory(order):
    global drinks
    for drink in order:
        recipe = drink['recipe']
        for i in range(len(drinks)):
            drinks[i] = drinks[i] - recipe[i]

def run_pump(pump, volume):
    print('running pump %d to get %d ml' % (pump, volume))

def pour(recipe):
    global drinks
    threads = []
    for i in range(len(drinks)):
        t = Thread(target=run_pump, args=(i, recipe[i],))
        t.start()
        threads.append(t)
    for t in threads:
        t.join()
            
def pour_drinks(name, order):
    global lock
    global in_use
    
    num_drinks = len(order)
    mes = 'drinks' if num_drinks > 1 else 'drink'
    display_on_lcd('Got it! %d %s\nfor %s' %(num_drinks, mes, name))
    
    for i in range(num_drinks):
        display_on_lcd('Place cup on\nholder & press pour')
        display_on_lcd('Pouring %s\nDrink %d of %d' % (order[i]['name'], i+1, num_drinks))
        pour(order[i]['recipe'])
        
    display_on_lcd('Done!\nEnjoy!')
    
    # un-comment if you want to test busy case
    # sleep(100)

    lock.acquire()
    in_use = False
    lock.release()
    
    display_on_lcd('Hi! Use our App\nto order drinks!')
    
        
if __name__ == '__main__':
    display_on_lcd('Hi! Use our App\nto order drinks!')
        
    global drinks
    global in_use
    global lock
    
    drinks = [100, 100, 100, 100, 100]
    in_use = False
    lock = Lock()
    app.run(port=8080, debug=False)