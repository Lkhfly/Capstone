from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from io import BytesIO

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/process_data', methods=['POST'])  # Route name matches the front-end
def process_data():
    file = request.files['file']
    print(file)
    # Log the file name for confirmation
    print(f"Received file: {file.filename}")

    df = pd.read_excel(BytesIO(file.read()), sheet_name='main')  # Replace 'main' with your actual sheet name
    group_df = df.groupby(['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Fault']).size().reset_index(name='Counts')
    grouped_data = group_df.to_dict(orient='records')

    # # Return a success response
    # return jsonify({"message": "File received successfully", "filename": file.filename})

    # return jsonify({"message": "File processed successfully", "data": grouped_data})
    print(grouped_data)

    # Return a JSON response with the processed data
    return jsonify({"message": "File processed successfully", "data": grouped_data})


if __name__ == "__main__":
    app.run(port=5000)
