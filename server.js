const http = require('http');
const fs = require('fs');
const os = require('os');

const server = http.createServer((req, res) => {
    // Log visitor info on /updateUser
    if (req.method === 'GET' && req.url === '/updateUser') {
        const timestamp = new Date().toISOString();
        const logEntry = `Visitor at ${timestamp}\n`;

        fs.appendFile('visitors.log', logEntry, (err) => {
            if (err) {
                res.end("Error updating log file");
            } else {
                res.end("User updated successfully");
            }
        });
    }
    else if (req.method === 'GET' && req.url === '/saveLogs') {
        // Read the visitors.log and save it to logs.txt
        fs.readFile('visitors.log', (err, data) => {
            if (err) return res.end("Error reading log");

            fs.writeFile('logs.txt', data, (err) => {
                if (err) res.end("Error saving logs");
                else res.end("Logs saved successfully");
            });
        });
    }
    else if (req.method === 'POST' && req.url === '/backupLogs') {
        // Backup the visitors.log to backup_logs.txt
        fs.copyFile('visitors.log', 'backup_logs.txt', (err) => {
            if (err) res.end("Error backing up logs");
            else res.end("Logs backed up successfully");
        });
    }

    else if (req.method === 'GET' && req.url === '/clearLogs') {
        // Clear the visitors.log file
        fs.writeFile('visitors.log', '', (err) => {
            if (err) res.end("Error clearing logs");
            else res.end("Logs cleared successfully");
        });
    }
    else if (req.method === 'GET' && req.url === '/serverInfo') {
        // Return server information as JSON
        const info = {
            hostname: os.hostname(),
            platform: os.platform(),
            uptime: os.uptime(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem()
        };

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(info));
    }

    else {
        res.statusCode = 404;
        res.end("Route not found");
    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});