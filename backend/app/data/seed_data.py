# seed_data.py: Comprehensive Realistic Data Seed for Indian Energy Security

INITIAL_CORRIDORS = [
    {
        "id": "c1",
        "name": "Strait of Hormuz",
        "code": "HORMUZ",
        "risk_score": 82.5,
        "status": "HIGH_RISK",
        "daily_vessel_count": 42,
        "transit_delay_days": 4.5,
        "war_risk_insurance_pct": 1.25,
        "threat_description": "Elevated US-Iran military standoff, naval patrols, GPS spoofing, and mine/missile threats along Iranian coast."
    },
    {
        "id": "c2",
        "name": "Bab-el-Mandeb & Red Sea",
        "code": "RED_SEA",
        "risk_score": 76.0,
        "status": "HIGH_RISK",
        "daily_vessel_count": 18,
        "transit_delay_days": 16.0,
        "war_risk_insurance_pct": 1.50,
        "threat_description": "Continuous Houthi anti-ship missile/drone attacks; major tankers forced into 16-day Cape of Good Hope detour."
    },
    {
        "id": "c3",
        "name": "Strait of Malacca",
        "code": "MALACCA",
        "risk_score": 24.0,
        "status": "NORMAL",
        "daily_vessel_count": 85,
        "transit_delay_days": 0.5,
        "war_risk_insurance_pct": 0.05,
        "threat_description": "Dense maritime traffic; low geopolitical threat; key corridor for Russian Far East (ESPO) & Asian trade."
    },
    {
        "id": "c4",
        "name": "Cape of Good Hope",
        "code": "CAPE_GH",
        "risk_score": 35.0,
        "status": "ELEVATED",
        "daily_vessel_count": 60,
        "transit_delay_days": 15.0,
        "war_risk_insurance_pct": 0.15,
        "threat_description": "Congestion at South African bunkering ports (Port Louis, Durban) due to Red Sea diversions."
    }
]

INITIAL_SUPPLIERS = [
    {
        "id": "s1",
        "country": "Saudi Arabia",
        "supplier_name": "Saudi Aramco",
        "export_terminal": "Ras Tanura & Ju'aymah (Persian Gulf)",
        "share_of_indian_imports_pct": 17.5,
        "risk_score": 70.0,
        "status": "ELEVATED",
        "key_vulnerabilities": "Transits Strait of Hormuz; partial bypass via East-West Petroline to Yanbu (Red Sea)."
    },
    {
        "id": "s2",
        "country": "Iraq",
        "supplier_name": "SOMO",
        "export_terminal": "Basrah Oil Terminal (Persian Gulf)",
        "share_of_indian_imports_pct": 21.0,
        "risk_score": 85.0,
        "status": "HIGH_RISK",
        "key_vulnerabilities": "100% dependent on Strait of Hormuz transit; vulnerable to regional escalation."
    },
    {
        "id": "s3",
        "country": "Russia",
        "supplier_name": "Rosneft / Lukoil",
        "export_terminal": "Primorsk, Novorossiysk & Kozmino",
        "share_of_indian_imports_pct": 36.0,
        "risk_score": 62.0,
        "status": "ELEVATED",
        "key_vulnerabilities": "G7 price cap sanctions, shadow fleet availability, payment/banking bottlenecks."
    },
    {
        "id": "s4",
        "country": "UAE",
        "supplier_name": "ADNOC",
        "export_terminal": "Fujairah (Gulf of Oman) & Das Island",
        "share_of_indian_imports_pct": 9.0,
        "risk_score": 38.0,
        "status": "NORMAL",
        "key_vulnerabilities": "Fujairah terminal bypasses Strait of Hormuz via ADCOP pipeline!"
    },
    {
        "id": "s5",
        "country": "Nigeria",
        "supplier_name": "NNPC",
        "export_terminal": "Bonny / Forcados",
        "share_of_indian_imports_pct": 4.5,
        "risk_score": 30.0,
        "status": "NORMAL",
        "key_vulnerabilities": "Atlantic transit, longer lead times (+22 days), sweet crude premium."
    },
    {
        "id": "s6",
        "country": "United States",
        "supplier_name": "US Gulf Coast Exporters",
        "export_terminal": "LOOP (Louisiana Offshore Oil Port) & Houston",
        "share_of_indian_imports_pct": 4.0,
        "risk_score": 15.0,
        "status": "NORMAL",
        "key_vulnerabilities": "Long voyage duration (~35 days), WTI Midland sweet crude."
    }
]

INITIAL_REFINERIES = [
    {
        "refinery_name": "Reliance Jamnagar Complex",
        "location": "Gujarat",
        "operator": "Reliance Industries",
        "nelson_complexity": 21.1,
        "baseline_throughput_bpd": 1240000.0,
        "crude_slate_compatibility": 0.98  # Can process heavy/sour
    },
    {
        "refinery_name": "Nayara Vadinar Refinery",
        "location": "Gujarat",
        "operator": "Nayara Energy",
        "nelson_complexity": 12.8,
        "baseline_throughput_bpd": 400000.0,
        "crude_slate_compatibility": 0.92
    },
    {
        "refinery_name": "IOCL Paradip Refinery",
        "location": "Odisha",
        "operator": "Indian Oil Corporation",
        "nelson_complexity": 12.2,
        "baseline_throughput_bpd": 300000.0,
        "crude_slate_compatibility": 0.90
    },
    {
        "refinery_name": "IOCL Panipat Refinery",
        "location": "Haryana",
        "operator": "Indian Oil Corporation",
        "nelson_complexity": 10.5,
        "baseline_throughput_bpd": 300000.0,
        "crude_slate_compatibility": 0.85
    },
    {
        "refinery_name": "BPCL Kochi Refinery",
        "location": "Kerala",
        "operator": "Bharat Petroleum",
        "nelson_complexity": 10.0,
        "baseline_throughput_bpd": 310000.0,
        "crude_slate_compatibility": 0.82
    },
    {
        "refinery_name": "HPCL Mumbai Refinery",
        "location": "Maharashtra",
        "operator": "Hindustan Petroleum",
        "nelson_complexity": 9.2,
        "baseline_throughput_bpd": 190000.0,
        "crude_slate_compatibility": 0.80
    },
    {
        "refinery_name": "MRPL Mangalore Refinery",
        "location": "Karnataka",
        "operator": "ONGC / MRPL",
        "nelson_complexity": 10.6,
        "baseline_throughput_bpd": 300000.0,
        "crude_slate_compatibility": 0.88
    }
]

INITIAL_ISPRL_CAVERNS = {
    "visakhapatnam": {
        "name": "Visakhapatnam SPR",
        "state": "Andhra Pradesh",
        "capacity_mmt": 1.33,
        "capacity_mbbl": 9.77,
        "current_stock_mbbl": 9.77,
        "linked_refineries": ["IOCL Paradip", "HPCL Visakhapatnam"]
    },
    "mangalore": {
        "name": "Mangalore SPR",
        "state": "Karnataka",
        "capacity_mmt": 1.50,
        "capacity_mbbl": 11.02,
        "current_stock_mbbl": 11.02,
        "linked_refineries": ["MRPL Mangalore", "BPCL Kochi"]
    },
    "padur": {
        "name": "Padur SPR",
        "state": "Karnataka",
        "capacity_mmt": 2.50,
        "capacity_mbbl": 18.37,
        "current_stock_mbbl": 18.37,
        "linked_refineries": ["MRPL Mangalore", "HPCL Mumbai", "BPCL Kochi"]
    }
}

INITIAL_NODES = [
    # Chokepoints
    {"id": "n_hormuz", "name": "Strait of Hormuz", "node_type": "CHOKEPOINT", "lat": 26.56, "lng": 56.25, "capacity_mbbl": 0, "current_volume_mbbl": 18.5, "status": "HIGH_RISK"},
    {"id": "n_redsea", "name": "Bab-el-Mandeb / Red Sea", "node_type": "CHOKEPOINT", "lat": 12.58, "lng": 43.33, "capacity_mbbl": 0, "current_volume_mbbl": 6.2, "status": "HIGH_RISK"},
    {"id": "n_malacca", "name": "Strait of Malacca", "node_type": "CHOKEPOINT", "lat": 2.50, "lng": 101.50, "capacity_mbbl": 0, "current_volume_mbbl": 15.0, "status": "NORMAL"},
    {"id": "n_cape", "name": "Cape of Good Hope", "node_type": "CHOKEPOINT", "lat": -34.35, "lng": 18.47, "capacity_mbbl": 0, "current_volume_mbbl": 12.0, "status": "ELEVATED"},

    # Export Terminals
    {"id": "n_ras_tanura", "name": "Ras Tanura Terminal (Saudi)", "node_type": "PORT_SPM", "lat": 26.64, "lng": 50.16, "capacity_mbbl": 50.0, "current_volume_mbbl": 35.0, "status": "ELEVATED"},
    {"id": "n_basrah", "name": "Basrah Oil Terminal (Iraq)", "node_type": "PORT_SPM", "lat": 29.68, "lng": 48.78, "capacity_mbbl": 40.0, "current_volume_mbbl": 28.0, "status": "HIGH_RISK"},
    {"id": "n_fujairah", "name": "Fujairah Terminal (ADCOP Bypass)", "node_type": "PORT_SPM", "lat": 25.18, "lng": 56.36, "capacity_mbbl": 30.0, "current_volume_mbbl": 22.0, "status": "NORMAL"},

    # Indian Ports & Refineries
    {"id": "n_vadinar", "name": "Vadinar SPM / Reliance Jamnagar & Nayara", "node_type": "REFINERY", "lat": 22.45, "lng": 69.66, "capacity_mbbl": 80.0, "current_volume_mbbl": 55.0, "status": "NORMAL"},
    {"id": "n_mundra", "name": "Mundra Terminal & Panipat Pipeline", "node_type": "PORT_SPM", "lat": 22.75, "lng": 69.70, "capacity_mbbl": 40.0, "current_volume_mbbl": 28.0, "status": "NORMAL"},
    {"id": "n_mangalore", "name": "MRPL Mangalore & ISPRL Caverns", "node_type": "ISPRL_CAVERN", "lat": 12.91, "lng": 74.85, "capacity_mbbl": 29.4, "current_volume_mbbl": 29.4, "status": "NORMAL"},
    {"id": "n_vizag", "name": "Visakhapatnam Port & ISPRL Cavern", "node_type": "ISPRL_CAVERN", "lat": 17.68, "lng": 83.21, "capacity_mbbl": 9.77, "current_volume_mbbl": 9.77, "status": "NORMAL"},
    {"id": "n_paradip", "name": "Paradip SPM & IOCL Refinery", "node_type": "REFINERY", "lat": 20.26, "lng": 86.67, "capacity_mbbl": 35.0, "current_volume_mbbl": 24.0, "status": "NORMAL"},

    # VLCC Tankers in Transit
    {"id": "n_vlcc_1", "name": "Desh Vishal (VLCC - 2M bbl Basrah Crude)", "node_type": "TANKER", "lat": 24.50, "lng": 58.20, "capacity_mbbl": 2.0, "current_volume_mbbl": 2.0, "status": "HIGH_RISK"},
    {"id": "n_vlcc_2", "name": "MT Swarna Kamal (VLCC - 2M bbl Urals Crude)", "node_type": "TANKER", "lat": 6.80, "lng": 79.50, "capacity_mbbl": 2.0, "current_volume_mbbl": 2.0, "status": "NORMAL"},
    {"id": "n_vlcc_3", "name": "MT Ratna Puja (Suezmax - 1M bbl Murban Crude)", "node_type": "TANKER", "lat": 21.10, "lng": 65.40, "capacity_mbbl": 1.0, "current_volume_mbbl": 1.0, "status": "NORMAL"}
]

INITIAL_EDGES = [
    {"id": "e1", "source_id": "n_basrah", "target_id": "n_hormuz", "distance_nautical_miles": 450, "normal_transit_days": 1.2, "risk_score": 85.0, "volume_in_transit_mbbl": 4.0},
    {"id": "e2", "source_id": "n_ras_tanura", "target_id": "n_hormuz", "distance_nautical_miles": 380, "normal_transit_days": 1.0, "risk_score": 75.0, "volume_in_transit_mbbl": 3.5},
    {"id": "e3", "source_id": "n_hormuz", "target_id": "n_vadinar", "distance_nautical_miles": 1200, "normal_transit_days": 3.2, "risk_score": 80.0, "volume_in_transit_mbbl": 6.0},
    {"id": "e4", "source_id": "n_fujairah", "target_id": "n_vadinar", "distance_nautical_miles": 1050, "normal_transit_days": 2.8, "risk_score": 25.0, "volume_in_transit_mbbl": 3.0},
    {"id": "e5", "source_id": "n_fujairah", "target_id": "n_mangalore", "distance_nautical_miles": 1350, "normal_transit_days": 3.6, "risk_score": 25.0, "volume_in_transit_mbbl": 2.0},
    {"id": "e6", "source_id": "n_malacca", "target_id": "n_paradip", "distance_nautical_miles": 1400, "normal_transit_days": 3.8, "risk_score": 20.0, "volume_in_transit_mbbl": 4.5}
]
