// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CorruptionScore
 * @dev Library for computing department corruption scores based on grievance handling metrics.
 *
 * Score Formula:
 *   score = ((slaBreaches * 40) + (falseResolutions * 35) + (escalations * 25)) * 100 / totalComplaints
 *   Capped at 100.
 *
 * Score Levels:
 *   0–20   Excellent
 *   21–40  Good
 *   41–60  Fair
 *   61–80  Poor
 *   81–100 Critical
 */
library CorruptionScore {
    struct DepartmentStats {
        uint256 totalComplaints;
        uint256 resolvedComplaints;
        uint256 slaBreaches;
        uint256 falseResolutions;   // citizen-rejected resolutions
        uint256 escalations;
        uint256 lastUpdated;
    }

    /**
     * @dev Calculate the corruption score for a department.
     * @return score 0–100 (higher = worse)
     */
    function calculateScore(DepartmentStats storage stats) internal view returns (uint256) {
        if (stats.totalComplaints == 0) return 0;

        uint256 weighted =
            (stats.slaBreaches * 40) +
            (stats.falseResolutions * 35) +
            (stats.escalations * 25);

        uint256 score = (weighted * 100) / stats.totalComplaints;

        return score > 100 ? 100 : score;
    }

    /**
     * @dev Increment total complaints for a department.
     */
    function recordNewComplaint(DepartmentStats storage stats) internal {
        stats.totalComplaints++;
        stats.lastUpdated = block.timestamp;
    }

    /**
     * @dev Record a successful resolution (citizen approved).
     */
    function recordResolution(DepartmentStats storage stats) internal {
        stats.resolvedComplaints++;
        stats.lastUpdated = block.timestamp;
    }

    /**
     * @dev Record an SLA breach (deadline passed without response).
     */
    function recordSlaBreach(DepartmentStats storage stats) internal {
        stats.slaBreaches++;
        stats.lastUpdated = block.timestamp;
    }

    /**
     * @dev Record a false resolution (citizen rejected the response).
     */
    function recordFalseResolution(DepartmentStats storage stats) internal {
        stats.falseResolutions++;
        stats.lastUpdated = block.timestamp;
    }

    /**
     * @dev Record an escalation event.
     */
    function recordEscalation(DepartmentStats storage stats) internal {
        stats.escalations++;
        stats.lastUpdated = block.timestamp;
    }
}
