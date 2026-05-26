// Ambient declaration kept while legacy admin/portal code still references
// the DocumentStoreTypes namespace by name (e.g. typing fields as
// `DocumentStoreTypes.Firestore`). The real SDK has been removed — see
// docs/architecture/stack-decision.md and src/lib/disabled-sdk.ts.
//
// New code MUST NOT use these types. Migrate to NeonDB / Supabase types.

/* eslint-disable @typescript-eslint/no-explicit-any */

declare namespace DocumentStoreTypes {
  type Firestore = any;
  type DocumentData = Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type DocumentReference<_T = any> = any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type CollectionReference<_T = any> = any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Query<_T = any> = any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type QuerySnapshot<_T = any> = any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type DocumentSnapshot<_T = any> = any;
  type WriteBatch = any;
  type Transaction = any;
  type Timestamp = any;
  type FieldValue = any;
}
