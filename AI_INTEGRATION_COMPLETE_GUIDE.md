# Complete AI Integration Guide for Enterprise Clients
### A Comprehensive Reference for AI Integration Consulting

---

## Table of Contents

1. [Database Systems Overview](#database-systems-overview)
2. [API Architecture & Types](#api-architecture--types)
3. [AI APIs & Models](#ai-apis--models)
4. [Integration Patterns](#integration-patterns)
5. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
6. [IoT & Edge Computing](#iot--edge-computing)
7. [Security Best Practices](#security-best-practices)
8. [Implementation Frameworks](#implementation-frameworks)
9. [Client Scenarios & Solutions](#client-scenarios--solutions)
10. [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## 1. Database Systems Overview

### 1.1 Relational Databases (SQL)

#### **PostgreSQL**
- **Use Cases**: Enterprise applications, complex queries, ACID compliance
- **Strengths**: Advanced features (JSONB, full-text search, PostGIS), excellent for AI data storage
- **AI Integration**: Direct SQL queries, connection pooling, stored procedures
- **Connection Methods**: 
  - Native drivers (psycopg2, node-postgres)
  - ORMs (Prisma, TypeORM, SQLAlchemy)
  - REST APIs (PostgREST, Supabase)
- **Example Connection**:
```python
import psycopg2
conn = psycopg2.connect(
    host="localhost",
    database="company_db",
    user="admin",
    password="secure_password"
)
```

#### **MySQL/MariaDB**
- **Use Cases**: Web applications, e-commerce, read-heavy workloads
- **Strengths**: High performance, wide adoption, excellent replication
- **AI Integration**: Similar to PostgreSQL, slightly less advanced features
- **Connection Methods**: mysql-connector, PyMySQL, mysqlclient

#### **Microsoft SQL Server**
- **Use Cases**: Enterprise Windows environments, .NET applications
- **Strengths**: Deep Windows integration, Business Intelligence tools
- **AI Integration**: Azure ML integration, R/Python stored procedures
- **Connection Methods**: pyodbc, pymssql, tedious (Node.js)

#### **Oracle Database**
- **Use Cases**: Large enterprises, financial systems, mission-critical applications
- **Strengths**: Extremely robust, advanced analytics, RAC clustering
- **AI Integration**: Oracle Machine Learning, APEX integration
- **Connection Methods**: cx_Oracle, node-oracledb

### 1.2 NoSQL Databases

#### **MongoDB (Document Store)**
- **Use Cases**: Flexible schemas, content management, real-time analytics
- **Strengths**: JSON-like documents, horizontal scaling, aggregation pipeline
- **AI Integration**: Vector search, Atlas AI integration
- **Connection Methods**: pymongo, mongoose, MongoDB drivers
- **Example**:
```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('company_data');
```

#### **Redis (Key-Value Store)**
- **Use Cases**: Caching, session management, real-time analytics
- **Strengths**: In-memory speed, pub/sub, data structures
- **AI Integration**: Caching AI responses, vector similarity search (RediSearch)
- **Connection Methods**: redis-py, ioredis, node-redis

#### **Cassandra (Wide-Column Store)**
- **Use Cases**: Time-series data, IoT data, high write throughput
- **Strengths**: Linear scalability, no single point of failure
- **AI Integration**: Batch processing, historical data analysis
- **Connection Methods**: cassandra-driver, DataStax drivers

#### **Neo4j (Graph Database)**
- **Use Cases**: Social networks, recommendation engines, fraud detection
- **Strengths**: Relationship queries, pattern matching
- **AI Integration**: Knowledge graphs, relationship-based AI
- **Connection Methods**: neo4j-driver, py2neo

#### **Elasticsearch (Search Engine)**
- **Use Cases**: Full-text search, log analysis, observability
- **Strengths**: Near real-time search, analytics, distributed
- **AI Integration**: Semantic search, vector search (kNN)
- **Connection Methods**: elasticsearch-py, @elastic/elasticsearch

### 1.3 Cloud-Native Databases

#### **Amazon DynamoDB**
- **Type**: NoSQL key-value/document store
- **Use Cases**: Serverless applications, gaming, IoT
- **AI Integration**: AWS SageMaker integration, streams for real-time processing

#### **Google Firestore**
- **Type**: NoSQL document database
- **Use Cases**: Mobile/web apps, real-time sync
- **AI Integration**: Firebase ML Kit, Vertex AI integration

#### **Azure Cosmos DB**
- **Type**: Multi-model (document, key-value, graph, column-family)
- **Use Cases**: Globally distributed applications
- **AI Integration**: Azure OpenAI Service integration

#### **Supabase**
- **Type**: PostgreSQL with real-time capabilities
- **Use Cases**: Modern web apps, rapid development
- **AI Integration**: Edge functions, vector embeddings, real-time subscriptions

### 1.4 Time-Series Databases

#### **InfluxDB**
- **Use Cases**: IoT sensors, monitoring, metrics
- **AI Integration**: Anomaly detection, predictive maintenance

#### **TimescaleDB**
- **Use Cases**: PostgreSQL-based time-series
- **AI Integration**: SQL-based analysis, forecasting

### 1.5 Vector Databases (AI-Specific)

#### **Pinecone**
- **Use Cases**: Semantic search, recommendation systems
- **Strengths**: Managed service, high performance

#### **Weaviate**
- **Use Cases**: AI-native applications, knowledge graphs
- **Strengths**: Built-in vectorization, GraphQL API

#### **Milvus**
- **Use Cases**: Large-scale vector similarity search
- **Strengths**: Open-source, GPU acceleration

#### **Chroma**
- **Use Cases**: Embedding databases, RAG applications
- **Strengths**: Simple, developer-friendly

---

## 2. API Architecture & Types

### 2.1 REST APIs

#### **Overview**
- **Protocol**: HTTP/HTTPS
- **Data Format**: JSON, XML
- **Methods**: GET, POST, PUT, PATCH, DELETE
- **Stateless**: Each request contains all necessary information

#### **Best Practices**
```javascript
// RESTful endpoint design
GET    /api/users           // Get all users
GET    /api/users/:id       // Get specific user
POST   /api/users           // Create user
PUT    /api/users/:id       // Full update
PATCH  /api/users/:id       // Partial update
DELETE /api/users/:id       // Delete user
```

#### **Authentication**
- API Keys: `Authorization: Bearer <token>`
- OAuth 2.0: Access tokens with refresh
- JWT: Stateless authentication

#### **Example Implementation**
```python
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/api/data', methods=['POST'])
def get_ai_response():
    data = request.json
    # Process with AI
    response = ai_model.predict(data)
    return jsonify({'result': response})
```

### 2.2 GraphQL APIs

#### **Overview**
- **Query Language**: Flexible data fetching
- **Single Endpoint**: `/graphql`
- **Strongly Typed**: Schema-based

#### **Advantages for AI**
- Request exactly what you need
- Reduce over-fetching
- Real-time subscriptions

#### **Example**
```graphql
query GetUserData {
  user(id: "123") {
    name
    surveys {
      year
      responses
    }
  }
}
```

### 2.3 gRPC APIs

#### **Overview**
- **Protocol**: HTTP/2
- **Data Format**: Protocol Buffers (binary)
- **Performance**: High throughput, low latency

#### **Use Cases**
- Microservices communication
- Real-time streaming
- IoT device communication

### 2.4 WebSocket APIs

#### **Overview**
- **Protocol**: Full-duplex communication
- **Use Cases**: Real-time updates, chat, live data

#### **AI Integration Example**
```javascript
const ws = new WebSocket('wss://api.example.com/ai-stream');
ws.onmessage = (event) => {
  const aiResponse = JSON.parse(event.data);
  updateUI(aiResponse);
};
```

### 2.5 Webhook APIs

#### **Overview**
- **Pattern**: Event-driven, push-based
- **Use Cases**: Notifications, async processing

#### **Example**
```javascript
// Webhook receiver
app.post('/webhook/ai-complete', (req, res) => {
  const result = req.body;
  // Process AI completion
  notifyUser(result);
  res.sendStatus(200);
});
```

---

## 3. AI APIs & Models

### 3.1 Large Language Models (LLMs)

#### **OpenAI API**
- **Models**: GPT-5, GPT-5-mini, GPT-5-nano, O3, O4-mini
- **Pricing**: Token-based (input + output)
- **Use Cases**: Chatbots, content generation, code assistance
- **Example**:
```python
from openai import OpenAI
client = OpenAI(api_key='sk-...')

response = client.chat.completions.create(
    model="gpt-5-2025-08-07",
    messages=[
        {"role": "system", "content": "You are a data analyst."},
        {"role": "user", "content": "Analyze this dataset..."}
    ],
    max_completion_tokens=1000
)
```

#### **Google Gemini**
- **Models**: Gemini 2.5 Pro, Flash, Flash-Lite
- **Strengths**: Multimodal (text, images, video), long context
- **Use Cases**: Document analysis, visual understanding

#### **Anthropic Claude**
- **Models**: Claude 3.5 Sonnet, Opus, Haiku
- **Strengths**: Long context (200K tokens), safety-focused
- **Use Cases**: Document analysis, research, coding

#### **Lovable AI Gateway**
- **Endpoint**: `https://ai.gateway.lovable.dev/v1/chat/completions`
- **Models**: Access to Google Gemini & OpenAI GPT-5
- **Advantage**: Unified interface, pre-configured
- **Example**:
```javascript
const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [{ role: 'user', content: 'Analyze this data...' }]
  })
});
```

### 3.2 Embedding Models

#### **OpenAI Embeddings**
- **Models**: text-embedding-3-large, text-embedding-3-small
- **Use Cases**: Semantic search, clustering, recommendations
- **Example**:
```python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input="Company financial report Q4 2024"
)
embedding = response.data[0].embedding  # 3072-dimensional vector
```

#### **Google Vertex AI Embeddings**
- **Models**: textembedding-gecko, multimodalembedding
- **Use Cases**: Multilingual embeddings, multimodal search

#### **Cohere Embeddings**
- **Models**: embed-english-v3.0, embed-multilingual-v3.0
- **Strengths**: Compression, multilingual support

### 3.3 Computer Vision APIs

#### **Google Cloud Vision**
- **Features**: Object detection, OCR, face detection, label detection
- **Use Cases**: Document processing, image moderation

#### **AWS Rekognition**
- **Features**: Face analysis, celebrity recognition, PPE detection
- **Use Cases**: Security, compliance

#### **Azure Computer Vision**
- **Features**: OCR, spatial analysis, image tagging
- **Use Cases**: Accessibility, content moderation

### 3.4 Speech & Audio APIs

#### **OpenAI Whisper**
- **Features**: Speech-to-text, translation
- **Example**:
```python
audio_file = open("meeting.mp3", "rb")
transcript = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file
)
```

#### **Google Cloud Speech-to-Text**
- **Features**: Real-time transcription, speaker diarization

#### **ElevenLabs**
- **Features**: Text-to-speech, voice cloning
- **Use Cases**: Voiceovers, audiobooks

### 3.5 Specialized AI APIs

#### **Hugging Face Inference API**
- **Models**: 100,000+ pre-trained models
- **Use Cases**: Custom fine-tuned models, niche tasks

#### **Cohere**
- **Features**: Classification, clustering, semantic search
- **Use Cases**: Enterprise NLP

#### **Replicate**
- **Features**: Run ML models via API (Stable Diffusion, FLUX, etc.)
- **Use Cases**: Image generation, video processing

---

## 4. Integration Patterns

### 4.1 Database to AI Pipeline

#### **Pattern 1: Direct Query → AI Processing**
```python
# 1. Query database
cursor = conn.cursor()
cursor.execute("SELECT * FROM survey_responses WHERE year = 2024")
data = cursor.fetchall()

# 2. Format for AI
context = f"Survey data: {json.dumps(data)}"

# 3. Send to AI
response = openai.chat.completions.create(
    model="gpt-5-mini",
    messages=[
        {"role": "system", "content": "You are a data analyst."},
        {"role": "user", "content": f"Analyze: {context}"}
    ]
)
```

#### **Pattern 2: ETL → Vector Store → AI**
```python
# 1. Extract from database
data = extract_from_postgres()

# 2. Transform (create embeddings)
embeddings = openai.embeddings.create(
    model="text-embedding-3-large",
    input=[row['text'] for row in data]
)

# 3. Load into vector DB
pinecone.upsert(vectors=[
    {'id': row['id'], 'values': emb, 'metadata': row}
    for row, emb in zip(data, embeddings)
])

# 4. Query with AI
query_embedding = openai.embeddings.create(input="Find similar surveys")
results = pinecone.query(vector=query_embedding, top_k=5)
```

#### **Pattern 3: Streaming Pipeline**
```javascript
// 1. Database change stream (MongoDB)
const changeStream = db.collection('events').watch();

changeStream.on('change', async (change) => {
  // 2. Process with AI in real-time
  const aiInsight = await analyzeWithAI(change.fullDocument);
  
  // 3. Store insights
  await db.collection('ai_insights').insertOne(aiInsight);
});
```

### 4.2 API Gateway Pattern

#### **Architecture**
```
Client → API Gateway → [Auth] → [Rate Limit] → AI Service → Database
                                                    ↓
                                            Cache (Redis)
```

#### **Implementation (Node.js + Express)**
```javascript
const express = require('express');
const app = express();

// Middleware: Authentication
app.use('/api/*', async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = await validateToken(token);
  req.user = user;
  next();
});

// Middleware: Rate limiting
const rateLimit = require('express-rate-limit');
app.use('/api/ai', rateLimit({
  windowMs: 60 * 1000,
  max: 10
}));

// Middleware: Caching
app.use('/api/data', async (req, res, next) => {
  const cached = await redis.get(req.url);
  if (cached) return res.json(JSON.parse(cached));
  next();
});

// AI endpoint
app.post('/api/ai/query', async (req, res) => {
  // 1. Get user context
  const userRole = await getUserRole(req.user.id);
  
  // 2. Fetch allowed data
  const data = await fetchDataByRole(userRole);
  
  // 3. Call AI
  const aiResponse = await callAI(req.body.query, data);
  
  // 4. Return
  res.json({ response: aiResponse });
});
```

### 4.3 Microservices Architecture

#### **Service Breakdown**
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│  API Gateway │────▶│   Auth      │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                    ┌──────┴───────┐
                    ▼              ▼
              ┌─────────┐    ┌─────────┐
              │ AI Svc  │    │ Data Svc│
              └─────────┘    └─────────┘
                    │              │
                    ▼              ▼
              ┌─────────┐    ┌─────────┐
              │ OpenAI  │    │   DB    │
              └─────────┘    └─────────┘
```

#### **Data Service (Python/FastAPI)**
```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

app = FastAPI()

@app.get("/api/data/surveys")
async def get_surveys(
    user_id: str,
    year: int,
    db: Session = Depends(get_db)
):
    # Role-based filtering
    user_role = get_user_role(user_id)
    visible_fields = get_visible_fields(user_role)
    
    # Query with filtering
    query = db.query(Survey).filter(Survey.year == year)
    results = [filter_fields(r, visible_fields) for r in query.all()]
    
    return {"data": results}
```

#### **AI Service (Node.js)**
```javascript
const express = require('express');
const app = express();

app.post('/api/ai/analyze', async (req, res) => {
  const { context, query } = req.body;
  
  // Call OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      { role: 'system', content: `Context: ${context}` },
      { role: 'user', content: query }
    ]
  });
  
  res.json({ analysis: response.choices[0].message.content });
});

app.listen(3001);
```

### 4.4 Event-Driven Architecture

#### **Pattern: Message Queue + AI Workers**
```
Database → Change Data Capture → Kafka/RabbitMQ → AI Workers → Results DB
```

#### **Implementation (with RabbitMQ)**
```python
import pika
import json

# Producer (database trigger)
def on_new_survey(survey_data):
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='ai_processing')
    
    channel.basic_publish(
        exchange='',
        routing_key='ai_processing',
        body=json.dumps(survey_data)
    )
    connection.close()

# Consumer (AI worker)
def process_with_ai(ch, method, properties, body):
    data = json.loads(body)
    
    # AI processing
    result = openai.chat.completions.create(
        model='gpt-5-mini',
        messages=[{'role': 'user', 'content': f"Analyze: {data}"}]
    )
    
    # Store result
    store_ai_insight(data['id'], result.choices[0].message.content)
    
    ch.basic_ack(delivery_tag=method.delivery_tag)

# Start worker
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.basic_consume(queue='ai_processing', on_message_callback=process_with_ai)
channel.start_consuming()
```

---

## 5. Role-Based Access Control (RBAC)

### 5.1 RBAC Fundamentals

#### **Core Concepts**
- **Subject**: User/Service requesting access
- **Object**: Resource being accessed (data, API endpoint)
- **Action**: Operation (read, write, delete)
- **Permission**: Allows subject to perform action on object
- **Role**: Collection of permissions

#### **RBAC Hierarchy**
```
User → Role → Permissions → Resources
```

### 5.2 Database-Level RBAC

#### **PostgreSQL Row-Level Security (RLS)**
```sql
-- Enable RLS
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Users see their own surveys
CREATE POLICY user_own_surveys ON survey_responses
  FOR SELECT
  USING (user_id = current_user_id());

-- Policy: Members see completed surveys
CREATE POLICY members_view_completed ON survey_responses
  FOR SELECT
  USING (
    submission_status = 'completed' AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = current_user_id()
      AND role IN ('member', 'admin')
    )
  );

-- Policy: Admins see everything
CREATE POLICY admins_view_all ON survey_responses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = current_user_id()
      AND role = 'admin'
    )
  );
```

#### **MongoDB Field-Level Security**
```javascript
// Aggregation pipeline with field filtering
const getFilteredData = async (userId, userRole) => {
  const visibleFields = await getVisibleFieldsByRole(userRole);
  
  const projection = {};
  visibleFields.forEach(field => projection[field] = 1);
  
  return db.collection('surveys').find(
    { status: 'completed' },
    { projection }
  ).toArray();
};
```

### 5.3 Application-Level RBAC

#### **Middleware Pattern (Node.js)**
```javascript
// Role definition
const ROLES = {
  VIEWER: 'viewer',
  MEMBER: 'member',
  ADMIN: 'admin'
};

// Permissions mapping
const PERMISSIONS = {
  [ROLES.VIEWER]: ['read:public'],
  [ROLES.MEMBER]: ['read:public', 'read:member-data', 'write:own-data'],
  [ROLES.ADMIN]: ['read:*', 'write:*', 'delete:*']
};

// Middleware: Check permission
const requirePermission = (permission) => {
  return async (req, res, next) => {
    const userRole = await getUserRole(req.user.id);
    const userPermissions = PERMISSIONS[userRole];
    
    if (!userPermissions.includes(permission) && !userPermissions.includes('*')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};

// Usage
app.get('/api/surveys', requirePermission('read:member-data'), async (req, res) => {
  // Handler
});
```

#### **Decorator Pattern (Python/FastAPI)**
```python
from functools import wraps
from fastapi import HTTPException, Depends

def require_role(allowed_roles: list):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            user = kwargs.get('current_user')
            if user.role not in allowed_roles:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Usage
@app.get("/api/admin/users")
@require_role(['admin'])
async def get_all_users(current_user: User = Depends(get_current_user)):
    return fetch_all_users()
```

### 5.4 Field-Level Visibility for AI

#### **Dynamic Field Filtering**
```python
# Field visibility configuration
FIELD_VISIBILITY = {
    'viewer': {
        'survey_responses_2024': [
            'organisation_name', 'fund_name', 'geographic_markets'
        ]
    },
    'member': {
        'survey_responses_2024': [
            'organisation_name', 'fund_name', 'geographic_markets',
            'target_fund_size', 'investments_made', 'sector_focus'
        ]
    },
    'admin': {
        'survey_responses_2024': '*'  # All fields
    }
}

def filter_data_for_ai(data, user_role, table_name):
    """Filter data before sending to AI based on user role"""
    visible_fields = FIELD_VISIBILITY[user_role][table_name]
    
    if visible_fields == '*':
        return data
    
    filtered_data = []
    for row in data:
        filtered_row = {k: v for k, v in row.items() if k in visible_fields}
        filtered_data.append(filtered_row)
    
    return filtered_data

# Integration with AI
async def process_ai_query(query, user_id):
    # Get user role
    user_role = await get_user_role(user_id)
    
    # Fetch data
    raw_data = await fetch_survey_data()
    
    # Filter by role
    filtered_data = filter_data_for_ai(raw_data, user_role, 'survey_responses_2024')
    
    # Send to AI
    context = f"Available data: {json.dumps(filtered_data)}"
    response = await call_ai(query, context)
    
    return response
```

### 5.5 Attribute-Based Access Control (ABAC)

#### **Advanced Pattern**
```python
# Policy definition
POLICIES = [
    {
        'resource': 'survey_responses',
        'condition': lambda user, resource: (
            resource['submission_status'] == 'completed' and
            user['role'] == 'member'
        ),
        'allowed_actions': ['read']
    },
    {
        'resource': 'survey_responses',
        'condition': lambda user, resource: (
            resource['user_id'] == user['id']
        ),
        'allowed_actions': ['read', 'write', 'delete']
    }
]

def check_access(user, resource, action):
    for policy in POLICIES:
        if policy['resource'] == resource['type']:
            if policy['condition'](user, resource):
                if action in policy['allowed_actions']:
                    return True
    return False
```

---

## 6. IoT & Edge Computing

### 6.1 IoT Architecture Overview

#### **IoT Stack**
```
Devices → Gateway → Cloud → AI Processing → Storage → Analytics Dashboard
```

#### **Communication Protocols**
- **MQTT**: Lightweight publish-subscribe messaging
- **CoAP**: Constrained Application Protocol (UDP-based)
- **HTTP/REST**: Traditional web protocols
- **LoRaWAN**: Long-range, low-power wide-area network
- **Zigbee**: Mesh networking for smart homes
- **BLE**: Bluetooth Low Energy

### 6.2 IoT Data Ingestion

#### **MQTT Broker Integration**
```python
import paho.mqtt.client as mqtt
import json

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe("factory/sensors/#")

def on_message(client, userdata, msg):
    data = json.loads(msg.payload)
    
    # Store in time-series database
    influxdb_client.write_points([{
        'measurement': 'sensor_readings',
        'tags': {'sensor_id': data['sensor_id']},
        'fields': {'temperature': data['temp'], 'humidity': data['humidity']}
    }])
    
    # AI anomaly detection
    if detect_anomaly(data):
        alert_system(data)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("mqtt.example.com", 1883, 60)
client.loop_forever()
```

#### **HTTP Ingestion API**
```javascript
app.post('/api/iot/ingest', async (req, res) => {
  const { device_id, readings } = req.body;
  
  // Validate device
  const device = await Device.findById(device_id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  
  // Store readings
  await TimeSeriesDB.insert({
    device_id,
    timestamp: new Date(),
    ...readings
  });
  
  // Process with AI
  const analysis = await analyzeIoTData(readings);
  
  res.json({ status: 'ok', analysis });
});
```

### 6.3 Edge AI Processing

#### **On-Device AI (TensorFlow Lite)**
```python
import tensorflow as tf

# Load model on edge device
interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

# Process sensor data locally
def process_sensor_reading(data):
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    interpreter.set_tensor(input_details[0]['index'], data)
    interpreter.invoke()
    
    prediction = interpreter.get_tensor(output_details[0]['index'])
    return prediction

# Only send to cloud if anomaly detected
reading = get_sensor_data()
prediction = process_sensor_reading(reading)

if prediction > THRESHOLD:
    send_to_cloud(reading, prediction)
```

#### **Edge Gateway (AWS IoT Greengrass)**
```python
import greengrasssdk

client = greengrasssdk.client('iot-data')

def lambda_handler(event, context):
    # Process locally on edge gateway
    sensor_data = event['sensor_data']
    
    # Run lightweight AI model
    result = run_edge_model(sensor_data)
    
    # Publish to cloud only if needed
    if result['needs_cloud_processing']:
        client.publish(
            topic='cloud/ai/process',
            payload=json.dumps(result)
        )
    
    return {'statusCode': 200}
```

### 6.4 IoT + AI Use Cases

#### **Predictive Maintenance**
```python
# Collect equipment telemetry
telemetry = {
    'vibration': sensor.read_vibration(),
    'temperature': sensor.read_temperature(),
    'pressure': sensor.read_pressure()
}

# Store in time-series DB
await influxdb.write(telemetry)

# AI prediction
prediction = await openai.chat.completions.create(
    model='gpt-5-mini',
    messages=[{
        'role': 'system',
        'content': 'You are a predictive maintenance expert.'
    }, {
        'role': 'user',
        'content': f'Analyze equipment data: {telemetry}. Predict failure risk.'
    }]
)

if 'high risk' in prediction.choices[0].message.content.lower():
    create_maintenance_ticket()
```

#### **Smart Building Management**
```javascript
// Aggregate sensor data
const buildingData = await Promise.all([
  getOccupancySensors(),
  getTemperatureSensors(),
  getLightSensors(),
  getEnergySensors()
]);

// AI optimization
const aiRecommendation = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [{
      role: 'user',
      content: `Optimize building HVAC based on: ${JSON.stringify(buildingData)}`
    }]
  })
});

// Execute recommendations
await applyBuildingSettings(aiRecommendation);
```

---

## 7. Security Best Practices

### 7.1 API Security

#### **Authentication Methods**

**1. API Keys**
```javascript
// Server-side validation
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !isValidApiKey(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

**2. JWT (JSON Web Tokens)**
```python
import jwt
from datetime import datetime, timedelta

def create_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception('Token expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')
```

**3. OAuth 2.0**
```javascript
// Using Passport.js
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://provider.com/oauth2/authorize',
    tokenURL: 'https://provider.com/oauth2/token',
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: 'https://yourapp.com/auth/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ providerId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Stricter limit for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'AI endpoint rate limit exceeded'
});

app.use('/api/', apiLimiter);
app.use('/api/ai/', aiLimiter);
```

#### **Input Validation**
```python
from pydantic import BaseModel, validator

class AIQueryRequest(BaseModel):
    query: str
    max_tokens: int = 1000
    
    @validator('query')
    def query_not_empty(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Query cannot be empty')
        if len(v) > 5000:
            raise ValueError('Query too long')
        return v
    
    @validator('max_tokens')
    def valid_tokens(cls, v):
        if v < 1 or v > 4000:
            raise ValueError('max_tokens must be between 1 and 4000')
        return v
```

### 7.2 Data Security

#### **Encryption at Rest**
```python
from cryptography.fernet import Fernet

# Generate key (store securely, e.g., AWS KMS, Azure Key Vault)
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# Encrypt sensitive data before storing
def encrypt_field(data):
    return cipher_suite.encrypt(data.encode()).decode()

def decrypt_field(encrypted_data):
    return cipher_suite.decrypt(encrypted_data.encode()).decode()

# Usage
sensitive_data = "Confidential information"
encrypted = encrypt_field(sensitive_data)
db.execute("INSERT INTO secure_data (encrypted_field) VALUES (?)", (encrypted,))
```

#### **Encryption in Transit (TLS/SSL)**
```javascript
// Node.js HTTPS server
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
```

#### **Database Encryption (PostgreSQL)**
```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypted column
CREATE TABLE sensitive_data (
    id SERIAL PRIMARY KEY,
    encrypted_field BYTEA
);

-- Insert encrypted data
INSERT INTO sensitive_data (encrypted_field)
VALUES (pgp_sym_encrypt('sensitive info', 'encryption_key'));

-- Decrypt data
SELECT pgp_sym_decrypt(encrypted_field, 'encryption_key')
FROM sensitive_data;
```

### 7.3 AI-Specific Security

#### **Prompt Injection Prevention**
```python
def sanitize_prompt(user_input):
    """Prevent prompt injection attacks"""
    # Remove system-level instructions
    forbidden_patterns = [
        r'ignore previous instructions',
        r'disregard',
        r'you are now',
        r'new role',
        r'system:',
        r'<\|im_start\|>',
    ]
    
    for pattern in forbidden_patterns:
        user_input = re.sub(pattern, '', user_input, flags=re.IGNORECASE)
    
    return user_input.strip()

def safe_ai_query(user_input, context):
    clean_input = sanitize_prompt(user_input)
    
    response = openai.chat.completions.create(
        model='gpt-5-mini',
        messages=[
            {
                'role': 'system',
                'content': f'You are a data analyst. Only answer based on: {context}'
            },
            {
                'role': 'user',
                'content': clean_input
            }
        ]
    )
    
    return response.choices[0].message.content
```

#### **Data Leakage Prevention**
```javascript
// Filter sensitive fields before AI processing
function filterSensitiveData(data) {
  const sensitiveFields = ['ssn', 'credit_card', 'password', 'api_key'];
  
  return data.map(item => {
    const filtered = { ...item };
    sensitiveFields.forEach(field => delete filtered[field]);
    return filtered;
  });
}

// Usage
app.post('/api/ai/analyze', async (req, res) => {
  const rawData = await fetchUserData(req.user.id);
  const safeData = filterSensitiveData(rawData);
  
  const analysis = await callAI(req.body.query, safeData);
  res.json({ analysis });
});
```

### 7.4 Compliance & Auditing

#### **Audit Logging**
```python
import logging
from datetime import datetime

class AuditLogger:
    def __init__(self):
        self.logger = logging.getLogger('audit')
    
    def log_ai_query(self, user_id, query, response, duration_ms):
        self.logger.info({
            'event': 'ai_query',
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id,
            'query_hash': hashlib.sha256(query.encode()).hexdigest(),
            'response_length': len(response),
            'duration_ms': duration_ms
        })
    
    def log_data_access(self, user_id, table, action, rows_affected):
        self.logger.info({
            'event': 'data_access',
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id,
            'table': table,
            'action': action,
            'rows_affected': rows_affected
        })

# Usage
audit = AuditLogger()
audit.log_ai_query(user_id, query, response, 342)
```

#### **GDPR Compliance**
```javascript
// Right to be forgotten
app.delete('/api/user/data', async (req, res) => {
  const userId = req.user.id;
  
  // Delete from all tables
  await Promise.all([
    db.query('DELETE FROM user_profiles WHERE id = ?', [userId]),
    db.query('DELETE FROM survey_responses WHERE user_id = ?', [userId]),
    db.query('DELETE FROM activity_log WHERE user_id = ?', [userId]),
    // Delete from vector DB
    await pinecone.delete({ filter: { user_id: userId } })
  ]);
  
  res.json({ message: 'All user data deleted' });
});

// Data export
app.get('/api/user/export', async (req, res) => {
  const userId = req.user.id;
  
  const userData = await fetchAllUserData(userId);
  
  res.setHeader('Content-Disposition', 'attachment; filename=user-data.json');
  res.json(userData);
});
```

---

## 8. Implementation Frameworks

### 8.1 Backend Frameworks

#### **Node.js + Express**
```javascript
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const app = express();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_KEY });

app.post('/api/query', async (req, res) => {
  const { user_id, query } = req.body;
  
  // Get user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user_id)
    .single();
  
  // Fetch role-appropriate data
  const { data } = await supabase
    .from('surveys')
    .select('*')
    .eq('status', 'completed');
  
  // Filter by visibility
  const filteredData = filterByRole(data, roleData.role);
  
  // AI processing
  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      { role: 'system', content: `Data: ${JSON.stringify(filteredData)}` },
      { role: 'user', content: query }
    ]
  });
  
  res.json({ answer: response.choices[0].message.content });
});

app.listen(3000);
```

#### **Python + FastAPI**
```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from openai import OpenAI
import uvicorn

app = FastAPI()
client = OpenAI(api_key=OPENAI_KEY)

@app.post("/api/query")
async def process_query(
    query: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user role
    user_role = db.query(UserRole).filter_by(user_id=current_user.id).first()
    
    # Fetch filtered data
    surveys = db.query(Survey).filter_by(status='completed').all()
    filtered = filter_by_role(surveys, user_role.role)
    
    # AI processing
    response = client.chat.completions.create(
        model='gpt-5-mini',
        messages=[
            {'role': 'system', 'content': f'Data: {json.dumps(filtered)}'},
            {'role': 'user', 'content': query}
        ]
    )
    
    return {'answer': response.choices[0].message.content}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
```

#### **Supabase Edge Functions (Deno)**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');
    
    // Get user role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    // Fetch filtered data
    const { data: surveys } = await supabaseClient
      .from('survey_responses_2024')
      .select('*')
      .eq('submission_status', 'completed');
    
    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: `Available data: ${JSON.stringify(surveys)}` },
          { role: 'user', content: query }
        ],
      }),
    });
    
    const aiData = await aiResponse.json();
    
    return new Response(JSON.stringify({
      response: aiData.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### 8.2 Frontend Frameworks

#### **React + TypeScript**
```typescript
import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function AIChat() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    
    // Call edge function
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { query }
    });
    
    if (error) {
      console.error('Error:', error);
    } else {
      setResponse(data.response);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleQuery} disabled={loading}>
        {loading ? 'Processing...' : 'Ask AI'}
      </button>
      {response && <div>{response}</div>}
    </div>
  );
}
```

### 8.3 Database ORM/Query Builders

#### **Prisma (Node.js/TypeScript)**
```typescript
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  role      Role     @default(VIEWER)
  surveys   Survey[]
}

model Survey {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  data      Json
  status    String
}

// Usage
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Query with relations
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    surveys: {
      where: { status: 'completed' }
    }
  }
});
```

#### **SQLAlchemy (Python)**
```python
from sqlalchemy import create_engine, Column, String, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    email = Column(String, unique=True)
    role = Column(String, default='viewer')
    surveys = relationship('Survey', back_populates='user')

class Survey(Base):
    __tablename__ = 'surveys'
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'))
    user = relationship('User', back_populates='surveys')
    data = Column(JSON)
    status = Column(String)

# Usage
engine = create_engine('postgresql://user:pass@localhost/db')
Session = sessionmaker(bind=engine)
session = Session()

user = session.query(User).filter_by(id=user_id).first()
surveys = session.query(Survey).filter_by(
    user_id=user_id, 
    status='completed'
).all()
```

---

## 9. Client Scenarios & Solutions

### 9.1 Scenario: E-commerce Company

#### **Client Needs**
- Product recommendations
- Customer service chatbot
- Inventory forecasting
- Fraud detection

#### **Database Setup**
- **Primary**: PostgreSQL (products, orders, customers)
- **Cache**: Redis (session, cart)
- **Search**: Elasticsearch (product search)
- **Vector**: Pinecone (recommendations)

#### **AI Integration**
```python
# Product recommendations
async def get_recommendations(user_id):
    # Get user purchase history
    purchases = await db.query(
        "SELECT * FROM purchases WHERE user_id = ?", user_id
    )
    
    # Create embedding
    user_vector = await openai.embeddings.create(
        model="text-embedding-3-large",
        input=json.dumps(purchases)
    )
    
    # Query vector DB
    similar_products = await pinecone.query(
        vector=user_vector.data[0].embedding,
        top_k=10,
        filter={'in_stock': True}
    )
    
    return similar_products

# Customer service bot
async def handle_support_query(query, customer_id):
    # Get customer context
    customer = await get_customer_profile(customer_id)
    orders = await get_recent_orders(customer_id)
    
    context = f"""
    Customer: {customer['name']}
    Recent orders: {json.dumps(orders)}
    """
    
    # Call AI
    response = await openai.chat.completions.create(
        model='gpt-5',
        messages=[
            {'role': 'system', 'content': f'You are a support agent. Context: {context}'},
            {'role': 'user', 'content': query}
        ]
    )
    
    return response.choices[0].message.content
```

### 9.2 Scenario: Healthcare Provider

#### **Client Needs**
- Patient record analysis
- Appointment scheduling optimization
- Medical image analysis
- Clinical decision support

#### **Database Setup**
- **Primary**: PostgreSQL (patient records, appointments)
- **Compliance**: Encrypted fields (HIPAA)
- **Images**: S3 + DynamoDB (metadata)
- **Time-series**: InfluxDB (vitals monitoring)

#### **AI Integration**
```python
# HIPAA-compliant AI processing
async def analyze_patient_record(patient_id, provider_id):
    # Verify provider access
    if not await verify_provider_access(provider_id, patient_id):
        raise HTTPException(403, "Access denied")
    
    # Fetch encrypted data
    patient = await db.query(
        "SELECT * FROM patients WHERE id = ?", patient_id
    )
    
    # Decrypt PHI (Protected Health Information)
    decrypted_data = decrypt_phi(patient)
    
    # Remove identifiers before AI processing (de-identification)
    deidentified = {
        'age': calculate_age(decrypted_data['dob']),
        'conditions': decrypted_data['conditions'],
        'medications': decrypted_data['medications'],
        'vitals': decrypted_data['vitals']
    }
    
    # AI analysis
    response = await openai.chat.completions.create(
        model='gpt-5',
        messages=[{
            'role': 'system',
            'content': 'You are a clinical decision support system. Provide evidence-based recommendations.'
        }, {
            'role': 'user',
            'content': f'Analyze patient data: {json.dumps(deidentified)}'
        }]
    )
    
    # Log access for audit
    await log_phi_access(patient_id, provider_id, 'AI_ANALYSIS')
    
    return response.choices[0].message.content

# Medical image analysis
async def analyze_medical_image(image_url):
    # Use vision API
    response = await openai.chat.completions.create(
        model='gpt-5',
        messages=[{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Analyze this medical image for abnormalities.'},
                {'type': 'image_url', 'image_url': {'url': image_url}}
            ]
        }]
    )
    
    return response.choices[0].message.content
```

### 9.3 Scenario: Manufacturing Company

#### **Client Needs**
- Predictive maintenance
- Quality control automation
- Supply chain optimization
- Production scheduling

#### **Database Setup**
- **Primary**: PostgreSQL (production data, schedules)
- **IoT Data**: InfluxDB (sensor readings)
- **Cache**: Redis (real-time metrics)
- **Message Queue**: RabbitMQ (machine events)

#### **AI Integration**
```python
# Predictive maintenance
async def predict_machine_failure(machine_id):
    # Get historical sensor data
    sensor_data = await influxdb.query(f"""
        SELECT * FROM sensor_readings
        WHERE machine_id = '{machine_id}'
        AND time > now() - 30d
    """)
    
    # Get maintenance history
    maintenance = await postgres.query(f"""
        SELECT * FROM maintenance_log
        WHERE machine_id = '{machine_id}'
        ORDER BY date DESC LIMIT 10
    """)
    
    # AI prediction
    response = await openai.chat.completions.create(
        model='gpt-5',
        messages=[{
            'role': 'system',
            'content': 'You are a predictive maintenance expert with access to industrial IoT data.'
        }, {
            'role': 'user',
            'content': f'''
                Analyze this machine data:
                Sensor readings (30 days): {json.dumps(sensor_data)}
                Maintenance history: {json.dumps(maintenance)}
                
                Predict:
                1. Probability of failure in next 7 days
                2. Recommended maintenance actions
                3. Critical components to inspect
            '''
        }]
    )
    
    return response.choices[0].message.content

# Quality control with computer vision
async def inspect_product(image_url):
    response = await openai.chat.completions.create(
        model='gpt-5',
        messages=[{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': 'Inspect this product for defects. List any issues found.'},
                {'type': 'image_url', 'image_url': {'url': image_url}}
            ]
        }]
    )
    
    result = response.choices[0].message.content
    
    # Log inspection
    await db.execute("""
        INSERT INTO quality_inspections (product_id, result, ai_analysis)
        VALUES (?, ?, ?)
    """, (product_id, 'PASS' if 'no defects' in result.lower() else 'FAIL', result))
    
    return result
```

### 9.4 Scenario: Financial Services

#### **Client Needs**
- Fraud detection
- Risk assessment
- Trading algorithm optimization
- Regulatory compliance monitoring

#### **Database Setup**
- **Primary**: PostgreSQL (transactions, accounts)
- **Time-series**: TimescaleDB (market data)
- **Graph**: Neo4j (transaction networks)
- **Cache**: Redis (real-time risk scores)

#### **AI Integration**
```python
# Fraud detection
async def detect_fraud(transaction):
    # Get user transaction history
    history = await db.query("""
        SELECT * FROM transactions
        WHERE user_id = ?
        ORDER BY timestamp DESC LIMIT 100
    """, transaction['user_id'])
    
    # Get network analysis (connected accounts)
    network = await neo4j.run("""
        MATCH (u:User {id: $user_id})-[:TRANSACTED_WITH*1..3]-(connected)
        RETURN connected.id, collected.risk_score
    """, user_id=transaction['user_id'])
    
    # AI fraud analysis
    response = await openai.chat.completions.create(
        model='gpt-5',
        messages=[{
            'role': 'system',
            'content': '''You are a fraud detection expert. Analyze transactions for suspicious patterns.
            Consider: unusual amounts, frequency, geographic anomalies, network relationships.'''
        }, {
            'role': 'user',
            'content': f'''
                New transaction: {json.dumps(transaction)}
                User history: {json.dumps(history)}
                Network analysis: {json.dumps(network)}
                
                Provide:
                1. Fraud risk score (0-100)
                2. Reasoning
                3. Recommended action (approve/review/block)
            '''
        }]
    )
    
    result = response.choices[0].message.content
    
    # Extract risk score
    risk_score = extract_risk_score(result)
    
    # Cache for real-time checks
    await redis.setex(f'fraud_score:{transaction["id"]}', 3600, risk_score)
    
    return result

# Regulatory compliance
async def check_compliance(report_data):
    # Get relevant regulations
    regulations = await db.query("""
        SELECT * FROM regulations
        WHERE applicable_to_entity = ?
    """, report_data['entity_id'])
    
    response = await openai.chat.completions.create(
        model='gpt-5',
        messages=[{
            'role': 'system',
            'content': f'You are a compliance officer. Regulations: {json.dumps(regulations)}'
        }, {
            'role': 'user',
            'content': f'Review this report for compliance: {json.dumps(report_data)}'
        }]
    )
    
    return response.choices[0].message.content
```

### 9.5 Scenario: Media & Content Company

#### **Client Needs**
- Content moderation
- Personalized recommendations
- Automatic captioning
- Content generation

#### **Database Setup**
- **Primary**: MongoDB (flexible content schemas)
- **Search**: Elasticsearch (content discovery)
- **CDN**: Cloudflare/CloudFront (media delivery)
- **Vector**: Weaviate (semantic search)

#### **AI Integration**
```python
# Content moderation
async def moderate_content(content_id):
    content = await mongo.find_one({'_id': content_id})
    
    # Moderate text
    text_result = await openai.moderations.create(
        input=content['text']
    )
    
    # Moderate images (if present)
    if content.get('images'):
        image_results = []
        for img_url in content['images']:
            result = await openai.chat.completions.create(
                model='gpt-5',
                messages=[{
                    'role': 'user',
                    'content': [
                        {'type': 'text', 'text': 'Check if this image violates content policy.'},
                        {'type': 'image_url', 'image_url': {'url': img_url}}
                    ]
                }]
            )
            image_results.append(result.choices[0].message.content)
    
    # Decision
    if text_result.results[0].flagged:
        await mongo.update_one(
            {'_id': content_id},
            {'$set': {'status': 'moderated', 'reason': text_result.results[0].categories}}
        )
        return 'REJECTED'
    
    return 'APPROVED'

# Personalized recommendations
async def get_content_recommendations(user_id):
    # Get user interaction history
    interactions = await mongo.find({
        'user_id': user_id,
        'type': {'$in': ['view', 'like', 'share']}
    }).sort('timestamp', -1).limit(50).to_list(50)
    
    # Create user preference embedding
    user_text = ' '.join([i['content_title'] for i in interactions])
    user_embedding = await openai.embeddings.create(
        model='text-embedding-3-large',
        input=user_text
    )
    
    # Query vector DB
    recommendations = await weaviate.query.get(
        'Content',
        ['title', 'description', 'url']
    ).with_near_vector({
        'vector': user_embedding.data[0].embedding
    }).with_limit(20).do()
    
    return recommendations
```

---

## 10. Troubleshooting & Common Issues

### 10.1 Database Connection Issues

#### **Problem: Connection timeout**
```python
# Solution: Connection pooling
from sqlalchemy.pool import QueuePool
from sqlalchemy import create_engine

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=0,
    pool_timeout=30,
    pool_recycle=3600,
    pool_pre_ping=True  # Verify connections before use
)
```

#### **Problem: Too many connections**
```javascript
// Solution: Implement connection pooling
const { Pool } = require('pg');
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Always release connections
app.post('/api/data', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM surveys');
    res.json(result.rows);
  } finally {
    client.release();
  }
});
```

### 10.2 AI API Issues

#### **Problem: Rate limiting (429 errors)**
```python
import time
from tenacity import retry, wait_exponential, stop_after_attempt

@retry(wait=wait_exponential(multiplier=1, min=4, max=60), stop=stop_after_attempt(5))
async def call_ai_with_retry(prompt):
    try:
        response = await openai.chat.completions.create(
            model='gpt-5-mini',
            messages=[{'role': 'user', 'content': prompt}]
        )
        return response.choices[0].message.content
    except RateLimitError as e:
        print(f"Rate limited, retrying... {e}")
        raise  # Will trigger retry
```

#### **Problem: Token limit exceeded**
```python
import tiktoken

def truncate_to_token_limit(text, max_tokens=8000):
    encoding = tiktoken.get_encoding("cl100k_base")
    tokens = encoding.encode(text)
    
    if len(tokens) > max_tokens:
        tokens = tokens[:max_tokens]
        text = encoding.decode(tokens)
    
    return text

# Usage
large_context = get_large_dataset()
truncated = truncate_to_token_limit(large_context, 7000)
response = await openai.chat.completions.create(
    model='gpt-5-mini',
    messages=[{'role': 'user', 'content': truncated}]
)
```

#### **Problem: Slow AI responses**
```javascript
// Solution: Streaming + caching
const cache = new Map();

async function getCachedAIResponse(query) {
  const cacheKey = hashQuery(query);
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const stream = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [{ role: 'user', content: query }],
    stream: true
  });
  
  let fullResponse = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullResponse += content;
    // Send chunk to client immediately
    sendChunkToClient(content);
  }
  
  cache.set(cacheKey, fullResponse);
  return fullResponse;
}
```

### 10.3 Performance Optimization

#### **Problem: Slow database queries**
```sql
-- Solution: Indexes
CREATE INDEX idx_surveys_user_status ON survey_responses(user_id, submission_status);
CREATE INDEX idx_surveys_year ON survey_responses(year);

-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM survey_responses
WHERE user_id = 'abc' AND submission_status = 'completed';

-- Optimize with materialized views
CREATE MATERIALIZED VIEW survey_analytics AS
SELECT
  year,
  COUNT(*) as total_responses,
  AVG(target_fund_size) as avg_fund_size
FROM survey_responses
WHERE submission_status = 'completed'
GROUP BY year;

-- Refresh periodically
REFRESH MATERIALIZED VIEW survey_analytics;
```

#### **Problem: Large data transfers**
```javascript
// Solution: Pagination + lazy loading
app.get('/api/surveys', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    db.query('SELECT * FROM surveys ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]),
    db.query('SELECT COUNT(*) as count FROM surveys')
  ]);
  
  res.json({
    data,
    pagination: {
      page,
      limit,
      total: total[0].count,
      pages: Math.ceil(total[0].count / limit)
    }
  });
});
```

### 10.4 Security Issues

#### **Problem: SQL Injection**
```python
# ❌ WRONG - Vulnerable
user_input = request.args.get('user_id')
query = f"SELECT * FROM users WHERE id = '{user_input}'"  # DANGEROUS!
cursor.execute(query)

# ✅ CORRECT - Parameterized queries
user_input = request.args.get('user_id')
query = "SELECT * FROM users WHERE id = ?"
cursor.execute(query, (user_input,))

# ✅ CORRECT - ORM
user = session.query(User).filter_by(id=user_input).first()
```

#### **Problem: Exposed API keys**
```javascript
// ❌ WRONG - Exposed in frontend
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: {
    'Authorization': 'Bearer sk-...'  // NEVER DO THIS!
  }
});

// ✅ CORRECT - Backend proxy
// Frontend
const response = await fetch('/api/ai/query', {
  method: 'POST',
  body: JSON.stringify({ query })
});

// Backend
app.post('/api/ai/query', async (req, res) => {
  const response = await openai.chat.completions.create({
    // API key stored securely in environment
    model: 'gpt-5-mini',
    messages: [{ role: 'user', content: req.body.query }]
  });
  res.json(response);
});
```

### 10.5 Monitoring & Logging

#### **Comprehensive Logging Setup**
```python
import logging
import json
from pythonjsonlogger import jsonlogger

# Configure JSON logging
logger = logging.getLogger()
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

# Log AI requests
def log_ai_request(user_id, query, response, duration):
    logger.info('ai_request', extra={
        'user_id': user_id,
        'query_length': len(query),
        'response_length': len(response),
        'duration_ms': duration,
        'model': 'gpt-5-mini',
        'timestamp': time.time()
    })

# Monitoring with Prometheus
from prometheus_client import Counter, Histogram, start_http_server

ai_requests_total = Counter('ai_requests_total', 'Total AI requests')
ai_request_duration = Histogram('ai_request_duration_seconds', 'AI request duration')

@ai_request_duration.time()
async def call_ai(query):
    ai_requests_total.inc()
    response = await openai.chat.completions.create(...)
    return response

# Start metrics server
start_http_server(8000)
```

---

## Summary: Quick Reference Table

| **Client Type** | **Database** | **AI API** | **Integration Pattern** |
|-----------------|--------------|------------|-------------------------|
| E-commerce | PostgreSQL + Redis | GPT-5, Embeddings | Vector search + REST API |
| Healthcare | PostgreSQL (encrypted) | GPT-5 (de-identified data) | HIPAA-compliant proxy |
| Manufacturing | InfluxDB + PostgreSQL | GPT-5 + Vision | IoT streaming + edge AI |
| Financial | TimescaleDB + Neo4j | GPT-5 + Embeddings | Real-time fraud detection |
| Media | MongoDB + Elasticsearch | GPT-5 + Moderation | Content pipeline + CDN |

---

## Next Steps for Implementation

1. **Discovery Phase**: Understand client's existing infrastructure
2. **Architecture Design**: Select appropriate databases, APIs, integration patterns
3. **Proof of Concept**: Build minimal viable integration
4. **Security Audit**: Implement RBAC, encryption, compliance measures
5. **Scalability Testing**: Load testing, optimization
6. **Deployment**: Gradual rollout with monitoring
7. **Training**: Educate client team
8. **Maintenance**: Ongoing monitoring, updates, optimization

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-26  
**Maintained by**: AI Integration Consulting Team
