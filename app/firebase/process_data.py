from flask import Flask, request, jsonify
from io import BytesIO
import pandas as pd
import openpyxl
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Global variable to store processed data
processed_data = None

@app.route('/process_data_excel', methods=['POST'])
def process_data_excel_post():
    global processed_data  # Use global variable to store processed data
    
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400  # Return error if no file is uploaded

    # Extracting the boolean value if a user picked quality or throughput 
    quality = request.form.get('quality')
    throughput = request.form.get('throughput')

    if quality:
        print(f"Received file for quality: {file.filename}")
        df = pd.read_excel(BytesIO(file.read()), sheet_name='main')  # Read the Excel file into a DataFrame
        group_df = df.groupby(['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Fault']).size().reset_index(name='Count')
        group_df['Count'] = group_df['Count'].apply(lambda x: str(x) if pd.notnull(x) else '')
        
        # Convert column names to lowercase for consistency
        group_df.columns = [group_df.lower().replace(' ', '') for group_df in group_df.columns]  # Convert all column names to lowercase
        
        
        print(group_df)
        
        processed_data = group_df.to_dict(orient='records')  # Store processed data in global variable
        return jsonify({"message": "File processed successfully for quality"}), 200

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
        
        processed_data = data  # Store processed data in global variable
        return jsonify({"message": "File processed successfully for throughput"}), 200

    else:
        return jsonify({"error": "No 'quality' or 'throughput' parameter provided"}), 400

# GET method to retrieve processed data
@app.route('/process_data_excel', methods=['GET'])
def process_data_excel_get():
    global processed_data  # Access global variable to retrieve processed data
    
    if processed_data is None:
        return jsonify({"error": "No data processed yet"}), 400  # If no data has been processed
    
    return jsonify(processed_data), 200  # Return processed data as JSON

if __name__ == '__main__':
    app.run(debug=True)


# @app.route('/process_data_reconcile', methods=['POST'])
# def process_data_reconcile():
#     # Extract form data sent in the request (station, downtime, stops)
#     station = request.form.get('station')
#     downtime = request.form.get('downtime')
#     stops = request.form.get('stops')

#     if not station or not downtime or not stops:
#         return jsonify({"error": "Missing required parameters"}), 400

#     # Shows that when a user inputs for station, downtime, and stops it goes to the backend
#     print(f"Received data - Station: {station}, Downtime: {downtime}, Stops: {stops}")

#     # Call the process_data_excel function and get the result (DataFrame)
#     excel_result = process_data_excel()  # This should returns a JSON response

#     # Check if the response is a valid JSON dictionary
#     if isinstance(excel_result.json, dict):
#         # Convert the form data to a DataFrame as well
#         form_data = pd.DataFrame({
#             'Station': [station],
#             'Downtime': [downtime],
#             'Stops': [stops]
#         })

#         # Compare the DataFrames
#         if excel_result.json == form_data.to_dict(orient="records"):
#             return "Values Do Match"
#         else:
#             return "Values Do Not Match"
#     else:
#         return jsonify({"error": "Failed to process Excel data correctly"}), 500


if __name__ == "__main__":
    app.run(port=5000)
