# Security Specification: Todo Master

## Data Invariants
1. A Todo must have a `userId` matching the authenticated user's UID.
2. A Todo's `text` must be a non-empty string under 1000 characters.
3. `createdAt` and `updatedAt` must be server-generated timestamps.
4. Users can only read/write their own todos.
5. Users cannot change the `userId` or `createdAt` fields on update.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempting to create a todo for another user.
```json
{ "text": "Hack", "userId": "another-uid", "completed": false }
```

2. **Shadow Field**: Adding a field not in schema.
```json
{ "text": "Task", "userId": "my-uid", "isVerified": true }
```

3. **Resource Poisoning (Large ID)**: Using a 2KB string as a Doc ID.

4. **Resource Poisoning (Large Text)**: Sending a 1MB string in `text`.

5. **Type Poisoning**: `completed` as a string instead of boolean.

6. **Missing Required Field**: Creating without `text`.

7. **Privilege Escalation**: Updating `userId` to someone else's.

8. **Immutable Field Tampering**: Updating `createdAt`.

9. **Terminal State Bypass**: If I had a "Terminal State", but in TODOs, it's open.

10. **Query Scraping**: Attempting to list ALL todos without a `userId` filter.

11. **Malicious ID Verification**: Using `/` or `..` in a document ID.

12. **Timestamp Spoofing**: Sending a client-side date instead of `request.time`.

## Test Runner
I will verify these in the rules.
