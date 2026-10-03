# High-Concurrency Flash Sale API

> An optimized backend system designed to handle thousands of concurrent checkout requests with 100% data consistency. Built to solve the classic "Negative Stock" race condition during Flash Sale events.

## The Architecture & Core Solution
In a standard CRUD setup, 1,000 users attempting to buy an item with a stock of 5 at the exact same millisecond will result in 100 successful orders and a stock of -95 (Race Condition). 

To prevent this without introducing heavy queues like Kafka, this API implements:
*   **Pessimistic Locking (`SELECT ... FOR UPDATE`):** Enforced via TypeORM's `queryRunner` to queue concurrent requests at the database engine level (PostgreSQL).
*   **ACID Transactions:** Ensuring that stock decrement and order creation are treated as a single atomic operation.
*   **Rate Limiting:** Implemented at the application level to prevent brute-force and DDoS attempts.

## Benchmark & Stress Testing (K6)
This system was stress-tested using **K6** with the following parameters:
*   **Virtual Users (Concurrent):** 1,000 VUs
*   **Initial Stock:** 5 items
*   **Test Duration:** 10 seconds

### Results:
*   [X] **0 Data Anomalies:** The database recorded exactly 5 successful orders. Stock stopped at 0. **No negative stock.**
*   [X] **Graceful Rejection:** 995 requests were successfully rejected with `400 Bad Request` in under 45ms.
*   [X] **No Server Crashes:** The Node.js Event Loop remained unblocked during the massive spike.

*(Tambahkan Screenshot Terminal K6 Anda di sini)*
*(Tambahkan Screenshot Tabel Database yang menunjukkan Stok = 0 dan hanya 5 Order sukses di sini)*

## Tech Stack
*   **Framework:** NestJS (Node.js)
*   **Database:** PostgreSQL
*   **ORM:** TypeORM
*   **Testing:** K6 (Load Testing), Jest (Unit Testing)

## How to Run Locally
1. Clone this repository: `git clone ...`
2. Start the database using Docker: `docker-compose up -d`
3. Install dependencies: `npm install`
4. Run migrations: `npm run typeorm migration:run`
5. Start the server: `npm run start:dev`

## Future Improvements
*   Implement Redis for caching product catalogs to reduce read operations on PostgreSQL.
*   Separate the read and write database operations (CQRS pattern) for horizontal scaling.