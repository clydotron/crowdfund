// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign  {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    struct RequestForExport {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping( address => bool ) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(manager == msg.sender);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;

        // TODO there is a potential bug here: if this sender is already an approver, do not increment the
        // approver count, otherwise can get into trouble. (if they contribute 3 times, and are the only contributor,
        // requests can never be approved!)
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {

        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender]);

        Request storage request = requests[index];
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function getAllRequests() public view returns (RequestForExport[] memory) {
        RequestForExport[] memory result = new RequestForExport[](requests.length);
        for (uint i=0; i<requests.length; i++ ) {
            Request storage src = requests[i];

            RequestForExport memory req;
            req.description = src.description;
            req.value = src.value;
            req.recipient = src.recipient;
            req.complete = src.complete;
            req.approvalCount = src.approvalCount;

            result[i] = req;
        }
        return result;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns ( uint, uint, uint, uint, address ) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
      