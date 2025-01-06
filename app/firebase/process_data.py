from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from io import BytesIO
import openpyxl

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/process_data_excel', methods=['POST'])
def process_data_excel():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400  # Return error if no file is uploaded

    # Extracting the boolean value if a user picked quality or if throughput 
    quality = request.form.get('quality')
    throughput = request.form.get('throughput')

    if quality:
        print(f"Received file for quality: {file.filename}")

        df = pd.read_excel(BytesIO(file.read()), sheet_name='main')  # Read the Excel file into a DataFrame
        group_df = df.groupby(['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Fault']).size().reset_index(name='Counts')
        
        print(group_df)

        # Convert DataFrame to JSON and return
        return jsonify(group_df.to_dict(orient='records'))  # Return as JSON

    elif throughput:
        print(f"Received file for throughput: {file.filename}")

        workbook = openpyxl.load_workbook(file, data_only=True)
        sheet = workbook.active

        value_ay1 = sheet['AY1'].value   # Station number
        value_ay3 = round(sheet['AY3'].value, 1)  # Total downtime
        value_ay4 = sheet['AY4'].value  # Total number of stops
        
        data = {
            'Station': [value_ay1],
            'Downtime': [value_ay3],
            'Stops': [value_ay4]
        }
        
        # printing data just to see how it looks on backend
        print(data) 

        # Return the data as JSON (convert the dictionary to JSON)
        return jsonify(data)

    else:
        return jsonify({"error": "No 'quality' or 'throughput' parameter provided"}), 400


@app.route('/process_data_reconcile', methods=['POST'])
def process_data_reconcile():
    # Extract form data sent in the request (station, downtime, stops)
    station = request.form.get('station')
    downtime = request.form.get('downtime')
    stops = request.form.get('stops')

    if not station or not downtime or not stops:
        return jsonify({"error": "Missing required parameters"}), 400

    print(f"Received data - Station: {station}, Downtime: {downtime}, Stops: {stops}")

    # Call the process_data_excel function and get the result (DataFrame)
    excel_result = process_data_excel()  # This now returns a JSON response

    # Check if the response is a valid JSON dictionary
    if isinstance(excel_result.json, dict):
        # Convert the form data to a DataFrame as well
        form_data = pd.DataFrame({
            'Station': [station],
            'Downtime': [downtime],
            'Stops': [stops]
        })

        # Compare the DataFrames
        if excel_result.json == form_data.to_dict(orient="records"):
            return "Values Do Match"
        else:
            return "Values Do Not Match"
    else:
        return jsonify({"error": "Failed to process Excel data correctly"}), 500


if __name__ == "__main__":
    app.run(port=5000)
