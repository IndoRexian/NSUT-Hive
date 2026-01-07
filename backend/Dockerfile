FROM python:3.13

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . ./

EXPOSE 8000

RUN 

CMD cd app && python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000