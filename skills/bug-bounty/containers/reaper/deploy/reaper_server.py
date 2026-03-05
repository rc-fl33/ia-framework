#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reaper MCP Server - Shared Volume Architecture
Reads from Reaper's SQLite database via shared Docker volume
Reaper runs separately - this only provides MCP analysis tools
"""

import sys
import json
import logging
import sqlite3
import time
from typing import Dict, List
from pathlib import Path
from mcp.server.fastmcp import FastMCP

# Configure logging to stderr
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stderr
)
logger = logging.getLogger("reaper-mcp-server")

# Initialize MCP server
mcp = FastMCP("reaper")

# Configuration - database mounted from shared volume
DB_PATH = Path("/data/reaper.db")

# === DATABASE HELPERS ===

def get_db_connection():
    """Get SQLite database connection from shared volume"""
    if not DB_PATH.exists():
        raise Exception(f"Reaper database not found at {DB_PATH}. Is Reaper running with shared volume?")

    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def query_db(query: str, params: tuple = ()) -> List[Dict]:
    """Execute query and return results as list of dicts"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]

# === MCP TOOLS ===

@mcp.tool()
async def reaper_status() -> str:
    """Check Reaper status and statistics from database"""
    try:
        if not DB_PATH.exists():
            return json.dumps({"error": "Reaper database not found. Ensure Reaper container is running with shared volume."})

        conn = get_db_connection()
        cursor = conn.cursor()

        # Get counts
        cursor.execute("SELECT COUNT(*) FROM projects")
        project_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM domains")
        domain_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM hosts")
        host_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM endpoints")
        endpoint_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM requests")
        request_count = cursor.fetchone()[0]

        conn.close()

        status = {
            "connected": True,
            "database_path": str(DB_PATH),
            "statistics": {
                "projects": project_count,
                "domains": domain_count,
                "hosts": host_count,
                "endpoints": endpoint_count,
                "requests": request_count
            }
        }

        return json.dumps(status, indent=2)

    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
async def list_projects() -> str:
    """List all projects in Reaper"""
    try:
        projects = query_db("SELECT * FROM projects ORDER BY created_at DESC")
        return json.dumps(projects, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
async def list_domains(project_id: str = "") -> str:
    """List domains, optionally filtered by project"""
    try:
        if project_id:
            domains = query_db(
                "SELECT * FROM domains WHERE project_id = ? ORDER BY created_at DESC",
                (project_id,)
            )
        else:
            domains = query_db("SELECT * FROM domains ORDER BY created_at DESC")

        return json.dumps(domains, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
async def list_hosts(domain_id: str = "") -> str:
    """List hosts, optionally filtered by domain"""
    try:
        if domain_id:
            hosts = query_db(
                "SELECT * FROM hosts WHERE domain_id = ? ORDER BY created_at DESC",
                (domain_id,)
            )
        else:
            hosts = query_db("SELECT * FROM hosts ORDER BY created_at DESC LIMIT 100")

        return json.dumps(hosts, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
async def list_endpoints(hostname: str = "", limit: str = "50") -> str:
    """List discovered endpoints, optionally filtered by hostname"""
    try:
        limit_int = int(limit)

        if hostname:
            endpoints = query_db(
                "SELECT * FROM endpoints WHERE hostname = ? ORDER BY created_at DESC LIMIT ?",
                (hostname, limit_int)
            )
        else:
            endpoints = query_db(
                "SELECT * FROM endpoints ORDER BY created_at DESC LIMIT ?",
                (limit_int,)
            )

        return json.dumps(endpoints, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
async def get_requests(endpoint_id: str = "", limit: str = "20") -> str:
    """Get captured HTTP requests with responses"""
    try:
        limit_int = int(limit)

        if endpoint_id:
            requests = query_db(
                """SELECT r.*, res.status_code, res.content_type, res.body as response_body
                   FROM requests r
                   LEFT JOIN responses res ON res.request_id = r.id
                   WHERE r.id = ?
                   ORDER BY r.created_at DESC LIMIT ?""",
                (endpoint_id, limit_int)
            )
        else:
            requests = query_db(
                """SELECT r.id, r.method, r.host, r.url, r.headers, r.body,
                          res.status_code, res.content_type, res.body as response_body
                   FROM requests r
                   LEFT JOIN responses res ON res.request_id = r.id
                   ORDER BY r.created_at DESC LIMIT ?""",
                (limit_int,)
            )

        return json.dumps(requests, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
async def analyze_bola_vulnerabilities(hostname: str = "") -> str:
    """
    Analyze requests for Broken Object Level Authorization (BOLA) vulnerabilities

    Looks for:
    - Numeric IDs in URLs
    - UUID patterns
    - Sequential resource access patterns
    """
    try:
        if hostname:
            requests = query_db(
                """SELECT r.id, r.method, r.url, r.headers, res.status_code
                   FROM requests r
                   LEFT JOIN responses res ON res.request_id = r.id
                   WHERE r.host LIKE ?""",
                (f"%{hostname}%",)
            )
        else:
            requests = query_db(
                """SELECT r.id, r.method, r.url, r.headers, res.status_code
                   FROM requests r
                   LEFT JOIN responses res ON res.request_id = r.id
                   LIMIT 200"""
            )

        findings = []

        # Analyze each request
        import re
        for req in requests:
            url = req.get("url", "")
            method = req.get("method", "")
            status = req.get("status_code", 0)

            # Check for numeric IDs in URL
            numeric_ids = re.findall(r'/(\d{1,10})(?:/|$|\?)', url)
            uuid_patterns = re.findall(r'/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', url, re.I)

            if numeric_ids or uuid_patterns:
                severity = "high" if status == 200 else "medium"

                findings.append({
                    "request_id": req["id"],
                    "severity": severity,
                    "type": "BOLA",
                    "method": method,
                    "url": url,
                    "status_code": status,
                    "description": f"Potential BOLA: Direct object reference found ({'numeric ID' if numeric_ids else 'UUID'})",
                    "recommendation": "Test if object IDs can be enumerated without proper authorization"
                })

        result = {
            "total_requests_analyzed": len(requests),
            "potential_vulnerabilities": len(findings),
            "findings": findings[:20]
        }

        return json.dumps(result, indent=2)

    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
async def analyze_parameter_pollution(hostname: str = "") -> str:
    """
    Analyze for HTTP Parameter Pollution vulnerabilities

    Looks for duplicate parameters and array parameters
    """
    try:
        if hostname:
            requests = query_db(
                "SELECT id, method, url, params FROM requests WHERE host LIKE ? LIMIT 200",
                (f"%{hostname}%",)
            )
        else:
            requests = query_db(
                "SELECT id, method, url, params FROM requests LIMIT 200"
            )

        findings = []

        for req in requests:
            url = req.get("url", "")
            params = req.get("params", "")

            if params:
                param_list = params.split("&")
                param_names = [p.split("=")[0] for p in param_list]

                # Check for duplicates
                seen = set()
                duplicates = set()
                for name in param_names:
                    if name in seen:
                        duplicates.add(name)
                    seen.add(name)

                if duplicates:
                    findings.append({
                        "request_id": req["id"],
                        "severity": "medium",
                        "type": "Parameter_Pollution",
                        "url": url,
                        "duplicate_params": list(duplicates),
                        "description": f"Duplicate parameters found: {', '.join(duplicates)}",
                        "recommendation": "Test parameter pollution by submitting multiple values"
                    })

        result = {
            "total_requests_analyzed": len(requests),
            "potential_vulnerabilities": len(findings),
            "findings": findings
        }

        return json.dumps(result, indent=2)

    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
async def analyze_injection_points(hostname: str = "") -> str:
    """
    Identify potential injection points (SQL, XSS, Command)

    Looks for input fields in POST bodies, query parameters, and headers
    """
    try:
        if hostname:
            requests = query_db(
                """SELECT r.id, r.method, r.url, r.headers, r.body, r.param_keys, r.body_keys
                   FROM requests r WHERE r.host LIKE ? LIMIT 200""",
                (f"%{hostname}%",)
            )
        else:
            requests = query_db(
                """SELECT r.id, r.method, r.url, r.headers, r.body, r.param_keys, r.body_keys
                   FROM requests r LIMIT 200"""
            )

        findings = []

        for req in requests:
            url = req.get("url", "")
            method = req.get("method", "")
            param_keys = req.get("param_keys", "")
            body_keys = req.get("body_keys", "")

            injection_points = []

            if param_keys:
                injection_points.extend([f"param:{k}" for k in param_keys.split(",")])

            if body_keys:
                injection_points.extend([f"body:{k}" for k in body_keys.split(",")])

            if injection_points:
                findings.append({
                    "request_id": req["id"],
                    "severity": "info",
                    "type": "Injection_Points",
                    "method": method,
                    "url": url,
                    "injection_points": injection_points,
                    "description": f"Found {len(injection_points)} potential injection points",
                    "recommendation": "Test with SQL, XSS, and command injection payloads"
                })

        result = {
            "total_requests_analyzed": len(requests),
            "requests_with_injection_points": len(findings),
            "findings": findings[:30]
        }

        return json.dumps(result, indent=2)

    except Exception as e:
        return json.dumps({"error": str(e)})

@mcp.tool()
async def generate_report(hostname: str = "") -> str:
    """Generate comprehensive security analysis report"""
    try:
        # Get all analysis results
        bola_result = json.loads(await analyze_bola_vulnerabilities(hostname))
        pollution_result = json.loads(await analyze_parameter_pollution(hostname))
        injection_result = json.loads(await analyze_injection_points(hostname))

        # Aggregate findings
        all_findings = []
        all_findings.extend(bola_result.get("findings", []))
        all_findings.extend(pollution_result.get("findings", []))
        all_findings.extend(injection_result.get("findings", []))

        # Count by severity
        severity_counts = {
            "high": sum(1 for f in all_findings if f.get("severity") == "high"),
            "medium": sum(1 for f in all_findings if f.get("severity") == "medium"),
            "low": sum(1 for f in all_findings if f.get("severity") == "low"),
            "info": sum(1 for f in all_findings if f.get("severity") == "info")
        }

        report = {
            "hostname": hostname or "all",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "summary": {
                "total_findings": len(all_findings),
                "by_severity": severity_counts,
                "requests_analyzed": bola_result.get("total_requests_analyzed", 0)
            },
            "findings": all_findings
        }

        return json.dumps(report, indent=2)

    except Exception as e:
        return json.dumps({"error": str(e)})

# === SERVER STARTUP ===

if __name__ == "__main__":
    logger.info("Starting Reaper MCP Server...")
    logger.info(f"Waiting for Reaper database at {DB_PATH}")
    logger.info("Ensure Reaper container is running with: docker run -v reaper-data:/app ...")
    logger.info("MCP server ready on stdio")

    # Run MCP server
    mcp.run()
