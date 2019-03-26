#handle a POST request
from flask import Flask, render_template, request, url_for, jsonify
from threading import Lock, Thread
from time import sleep
import board
import digitalio
import adafruit_character_lcd.character_lcd as characterlcd
import RPi.GPIO as GPIO
from gpiozero import Button

app = Flask(__name__)

global drinks
global in_use
global lock
global lcd
global button

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
    global lcd 
    lcd.clear()
    lcd.message = message
    
def update_inventory(order):
    global drinks
    for drink in order:
        recipe = drink['recipe']
        for i in range(len(drinks)):
            drinks[i] = drinks[i] - recipe[i]

def run_pump(pump, volume):
    pumps = [5, 6, 13, 19, 26]
    GPIO.output(pumps[pump], GPIO.LOW)
    sleep(volume/2.27) # 2.27 ml/s is the calculated flow rate
    GPIO.output(pumps[pump], GPIO.HIGH)

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
    global button
    global in_use
    
    num_drinks = len(order)
    mes = 'drinks' if num_drinks > 1 else 'drink'
    display_on_lcd('Got it! %d %s\nfor %s' %(num_drinks, mes, name))
    
    # wait for couple seconds
    sleep(4)
    
    for i in range(num_drinks):
        display_on_lcd('Place cup on\nholder & press pour')
        
        # wait for user to press start
        button.wait_for_press()
        display_on_lcd('Pouring %s\nDrink %d of %d' % (order[i]['name'], i+1, num_drinks))
        pour(order[i]['recipe'])
        
    display_on_lcd('Done!\nEnjoy!')
    
    # wait for a couple seconds
    sleep(4)
    
    lock.acquire()
    in_use = False
    lock.release()
    
    display_on_lcd('Hi! Use our App\nto order drinks!')
    
def setup_lcd():
    global lcd
    # Modify this if you have a different sized character LCD
    lcd_columns = 24
    lcd_rows = 2

    lcd_rs = digitalio.DigitalInOut(board.D22)
    lcd_en = digitalio.DigitalInOut(board.D17)
    lcd_d4 = digitalio.DigitalInOut(board.D25)
    lcd_d5 = digitalio.DigitalInOut(board.D24)
    lcd_d6 = digitalio.DigitalInOut(board.D23)
    lcd_d7 = digitalio.DigitalInOut(board.D18)
    
    # Initialise the lcd class
    lcd = characterlcd.Character_LCD_Mono(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6,
                                          lcd_d7, lcd_columns, lcd_rows)


        
if __name__ == '__main__':
    setup_lcd()
    display_on_lcd('Hi! Use our App\nto order drinks!')
    pumps = [5, 6, 13, 19, 26]
    for pin in pumps:
        GPIO.setup(pin,GPIO.OUT)
        GPIO.output(pin, GPIO.HIGH)
        
    global drinks
    global in_use
    global lock
    global button
    button = Button(21)
    drinks = [100, 100, 100, 100, 100]
    in_use = False
    lock = Lock()
    app.run(port=8080, debug=False)