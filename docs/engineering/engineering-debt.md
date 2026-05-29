# Engineering Debt

## Redis/BullMQ Typing

Status: TECH_DEBT

Current workaround:

connection: workerConnection as any

Reason:
BullMQ + ioredis typing incompatibility.

Future fix:
Create centralized typed Redis/BullMQ factory.