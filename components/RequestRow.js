import React, { useState } from 'react';
import { Button, TableRow, TableCell } from 'semantic-ui-react'

function RequestRow(props) {
  const [approving, setApproving] = useState(false);

  const { id, request, approversCount, manager, onApprove, onFinalize } = props
  const readyToFinalize = request.approvalCount > (approversCount / 2)

  // add spinner to onApprove
  const handleApprove =  async () => {
    setApproving(true)
    try {
      onApprove(id)
    } catch (err) {
      console.log(err)
    }
    setApproving(false)
  }

  return (
    <TableRow disabled={request.complete} positive={readyToFinalize && !request.complete}>
      <TableCell>{id}</TableCell>
      <TableCell>{request.description}</TableCell>
      <TableCell>{request.amount}</TableCell>
      <TableCell>{request.recipient}</TableCell>
      <TableCell>{request.approvalCount}/{approversCount}</TableCell>
      <TableCell>
        {request.complete ? null : (
          <Button color="green" disabled={approving} basic onClick={handleApprove}>Approve</Button>
        )}
      </TableCell>
      {manager &&
      <TableCell>
          {request.complete ? null : (
            <Button disabled={!readyToFinalize} color="teal" basic onClick={() => onFinalize(id)}>Finalize</Button>
          )}
      </TableCell>
      }
 
    </TableRow>
  )
}
export default RequestRow;