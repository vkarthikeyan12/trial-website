from flask import Flask, render_template

app = Flask(__name__)

# Route for the home page
@app.route('/')
def home():
    return render_template('index.html')  # Flask automatically looks in the 'templates' folder

if __name__ == '__main__':
    app.run(debug=True)