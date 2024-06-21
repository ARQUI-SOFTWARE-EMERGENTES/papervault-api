// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

contract ResearchsContract {

    enum Status { PENDING, APPROVED, REJECTED }

    event CreatedResearch (
        string title,
        string abstractText,
        string content,
        string doi,
        Status status,
        string uploadedBy,
        string actionBy,
        uint counter
    );

    event changeStatus (
        string title,
        Status status,
        string actionBy,
        uint counter
    );

    struct Research {
        string title;
        string abstractText;
        string content;
        string doi;
        Status status;
        string uploadedBy;
        string actionBy;
    }

    mapping(uint => Research) public researchs;
    uint researchsCount = 1;

    function uploadResearch(string memory _title, string memory _abstractText, string memory _content, string memory _doi, string memory _uploadedBy) public {
        researchs[researchsCount] = Research(_title, _abstractText, _content, _doi, Status.PENDING, _uploadedBy, "");
        emit CreatedResearch(_title, _abstractText, _content, _doi, Status.PENDING, _uploadedBy, "", researchsCount);
        researchsCount++;
    }

    function approveResearch(uint _counter, string memory _action) public {
        Research memory research = researchs[_counter];
        research.status = Status.APPROVED;
        research.actionBy = _action;
        researchs[researchsCount] = research;
        emit changeStatus(research.title, Status.APPROVED, _action, researchsCount);
        researchsCount++;
    }

    function rejectResearch(uint _counter, string memory _action) public {
        Research memory research = researchs[_counter];
        research.status = Status.REJECTED;
        research.actionBy = _action;
        researchs[researchsCount] = research;
        emit changeStatus(research.title, Status.REJECTED, _action, researchsCount);
        researchsCount++;
    }

    function getResearch(uint _counter) public view returns (Research memory) {
        return researchs[_counter];
    }

}