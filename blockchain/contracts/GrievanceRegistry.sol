// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./CorruptionScore.sol";

/**
 * @title GrievanceRegistry
 * @dev Immutable, tamper-proof public grievance redressal system.
 *      Complaints are permanently stored on-chain and cannot be deleted.
 *      Features: SLA enforcement, auto-escalation, citizen approval, corruption scoring.
 */
contract GrievanceRegistry {
    using CorruptionScore for CorruptionScore.DepartmentStats;

    // ────────────────────────── Enums ──────────────────────────
    enum ComplaintStatus {
        Filed,
        UnderReview,
        Responded,
        Escalated,
        Resolved,
        CitizenRejected
    }

    // ────────────────────────── Structs ──────────────────────────
    struct Complaint {
        uint256 id;
        address citizen;
        string department;
        string title;
        string description;
        string ipfsHash;
        ComplaintStatus status;
        uint256 createdAt;
        uint256 responseDeadline;
        bool escalated;
        bool citizenApproved;
        string responseText;
        uint256 respondedAt;
        uint8 escalationLevel;
        bool isAnonymous;
    }

    struct Department {
        string name;
        address official;
        bool exists;
    }

    // ────────────────────────── State ──────────────────────────
    address public owner;
    uint256 public complaintCount;
    uint256 public constant SLA_DURATION = 7 days;

    mapping(uint256 => Complaint) public complaints;
    mapping(string => Department) public departments;
    mapping(string => CorruptionScore.DepartmentStats) public departmentStats;

    string[] public departmentNames;

    // ────────────────────────── Events ──────────────────────────
    event ComplaintFiled(
        uint256 indexed complaintId,
        address indexed citizen,
        string department,
        uint256 timestamp
    );
    event ComplaintResponded(
        uint256 indexed complaintId,
        string department,
        uint256 timestamp
    );
    event ComplaintEscalated(
        uint256 indexed complaintId,
        uint8 escalationLevel,
        uint256 timestamp
    );
    event ComplaintResolved(
        uint256 indexed complaintId,
        uint256 timestamp
    );
    event ComplaintRejected(
        uint256 indexed complaintId,
        uint256 timestamp
    );
    event DepartmentRegistered(
        string name,
        address official
    );

    // ────────────────────────── Modifiers ──────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyDepartmentOfficial(string memory dept) {
        require(departments[dept].exists, "Department does not exist");
        require(
            msg.sender == departments[dept].official,
            "Not department official"
        );
        _;
    }

    modifier complaintExists(uint256 _id) {
        require(_id > 0 && _id <= complaintCount, "Complaint does not exist");
        _;
    }

    // ────────────────────────── Constructor ──────────────────────────
    constructor() {
        owner = msg.sender;

        // Register default departments
        _registerDepartment("Public Works", msg.sender);
        _registerDepartment("Health", msg.sender);
        _registerDepartment("Education", msg.sender);
        _registerDepartment("Police", msg.sender);
        _registerDepartment("Revenue", msg.sender);
        _registerDepartment("Transport", msg.sender);
        _registerDepartment("Water Supply", msg.sender);
        _registerDepartment("Electricity", msg.sender);
    }

    // ────────────────────────── Department Management ──────────────────────────
    function registerDepartment(string memory _name, address _official) external onlyOwner {
        _registerDepartment(_name, _official);
    }

    function _registerDepartment(string memory _name, address _official) internal {
        if (!departments[_name].exists) {
            departmentNames.push(_name);
        }
        departments[_name] = Department(_name, _official, true);
        emit DepartmentRegistered(_name, _official);
    }

    function updateDepartmentOfficial(string memory _name, address _official) external onlyOwner {
        require(departments[_name].exists, "Department does not exist");
        departments[_name].official = _official;
    }

    // ────────────────────────── Complaint Filing ──────────────────────────
    function createComplaint(
        string memory _department,
        string memory _title,
        string memory _description,
        string memory _ipfsHash,
        bool _isAnonymous
    ) external {
        require(departments[_department].exists, "Invalid department");
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_description).length > 0, "Description required");

        complaintCount++;

        complaints[complaintCount] = Complaint({
            id: complaintCount,
            citizen: msg.sender,
            department: _department,
            title: _title,
            description: _description,
            ipfsHash: _ipfsHash,
            status: ComplaintStatus.Filed,
            createdAt: block.timestamp,
            responseDeadline: block.timestamp + SLA_DURATION,
            escalated: false,
            citizenApproved: false,
            responseText: "",
            respondedAt: 0,
            escalationLevel: 0,
            isAnonymous: _isAnonymous
        });

        departmentStats[_department].recordNewComplaint();

        emit ComplaintFiled(complaintCount, msg.sender, _department, block.timestamp);
    }

    // ────────────────────────── Department Response ──────────────────────────
    function respondToComplaint(
        uint256 _complaintId,
        string memory _responseText
    ) external complaintExists(_complaintId) onlyDepartmentOfficial(complaints[_complaintId].department) {
        Complaint storage c = complaints[_complaintId];

        require(
            c.status == ComplaintStatus.Filed ||
            c.status == ComplaintStatus.Escalated ||
            c.status == ComplaintStatus.CitizenRejected,
            "Cannot respond to this complaint"
        );
        require(bytes(_responseText).length > 0, "Response text required");

        c.status = ComplaintStatus.Responded;
        c.responseText = _responseText;
        c.respondedAt = block.timestamp;

        emit ComplaintResponded(_complaintId, c.department, block.timestamp);
    }

    // ────────────────────────── Citizen Approval ──────────────────────────
    function approveResolution(uint256 _complaintId) external complaintExists(_complaintId) {
        Complaint storage c = complaints[_complaintId];

        require(msg.sender == c.citizen, "Only the filing citizen can approve");
        require(c.status == ComplaintStatus.Responded, "Complaint not responded to");

        c.status = ComplaintStatus.Resolved;
        c.citizenApproved = true;

        departmentStats[c.department].recordResolution();

        emit ComplaintResolved(_complaintId, block.timestamp);
    }

    function rejectResolution(uint256 _complaintId) external complaintExists(_complaintId) {
        Complaint storage c = complaints[_complaintId];

        require(msg.sender == c.citizen, "Only the filing citizen can reject");
        require(c.status == ComplaintStatus.Responded, "Complaint not responded to");

        c.status = ComplaintStatus.CitizenRejected;

        departmentStats[c.department].recordFalseResolution();

        emit ComplaintRejected(_complaintId, block.timestamp);
    }

    // ────────────────────────── Escalation ──────────────────────────
    /**
     * @dev Anyone can call this. If the SLA deadline has passed and
     *      the complaint has not been responded to, it auto-escalates.
     */
    function escalateComplaint(uint256 _complaintId) external complaintExists(_complaintId) {
        Complaint storage c = complaints[_complaintId];

        require(
            c.status == ComplaintStatus.Filed ||
            c.status == ComplaintStatus.CitizenRejected,
            "Cannot escalate this complaint"
        );
        require(block.timestamp > c.responseDeadline, "SLA deadline not yet reached");
        require(c.escalationLevel < 3, "Maximum escalation level reached");

        c.escalationLevel++;
        c.escalated = true;
        c.status = ComplaintStatus.Escalated;
        c.responseDeadline = block.timestamp + SLA_DURATION; // reset SLA

        departmentStats[c.department].recordSlaBreach();
        departmentStats[c.department].recordEscalation();

        emit ComplaintEscalated(_complaintId, c.escalationLevel, block.timestamp);
    }

    // ────────────────────────── View Functions ──────────────────────────
    function getComplaint(uint256 _id) external view complaintExists(_id) returns (Complaint memory) {
        return complaints[_id];
    }

    function getAllComplaints() external view returns (Complaint[] memory) {
        Complaint[] memory all = new Complaint[](complaintCount);
        for (uint256 i = 1; i <= complaintCount; i++) {
            all[i - 1] = complaints[i];
        }
        return all;
    }

    function getComplaintsByDepartment(string memory _dept) external view returns (Complaint[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= complaintCount; i++) {
            if (keccak256(bytes(complaints[i].department)) == keccak256(bytes(_dept))) {
                count++;
            }
        }

        Complaint[] memory result = new Complaint[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= complaintCount; i++) {
            if (keccak256(bytes(complaints[i].department)) == keccak256(bytes(_dept))) {
                result[idx] = complaints[i];
                idx++;
            }
        }
        return result;
    }

    function getComplaintsByCitizen(address _citizen) external view returns (Complaint[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= complaintCount; i++) {
            if (complaints[i].citizen == _citizen) {
                count++;
            }
        }

        Complaint[] memory result = new Complaint[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= complaintCount; i++) {
            if (complaints[i].citizen == _citizen) {
                result[idx] = complaints[i];
                idx++;
            }
        }
        return result;
    }

    function getDepartmentScore(string memory _dept) external view returns (uint256) {
        return departmentStats[_dept].calculateScore();
    }

    function getDepartmentStats(string memory _dept)
        external
        view
        returns (
            uint256 totalComplaints,
            uint256 resolvedComplaints,
            uint256 slaBreaches,
            uint256 falseResolutions,
            uint256 escalations,
            uint256 score
        )
    {
        CorruptionScore.DepartmentStats storage stats = departmentStats[_dept];
        return (
            stats.totalComplaints,
            stats.resolvedComplaints,
            stats.slaBreaches,
            stats.falseResolutions,
            stats.escalations,
            stats.calculateScore()
        );
    }

    function getDepartmentCount() external view returns (uint256) {
        return departmentNames.length;
    }

    function getDepartmentNameByIndex(uint256 _index) external view returns (string memory) {
        require(_index < departmentNames.length, "Index out of bounds");
        return departmentNames[_index];
    }

    function getAllDepartmentNames() external view returns (string[] memory) {
        return departmentNames;
    }
}
