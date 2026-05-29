let started = false;

export function startMemoryReconciliation() {
  if (started) {
    return;
  }

  started = true;
}