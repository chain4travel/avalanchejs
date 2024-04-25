"use strict";
/**
 * @packageDocumentation
 * @module PlatformVM-Interfaces
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqIEBtb2R1bGUgUGxhdGZvcm1WTS1JbnRlcmZhY2VzXG4gKi9cblxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXG5pbXBvcnQgeyBQZXJzaXN0YW5jZU9wdGlvbnMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvcGVyc2lzdGVuY2VvcHRpb25zXCJcbmltcG9ydCB7IENsYWltVHlwZSwgVHJhbnNmZXJhYmxlSW5wdXQsIFRyYW5zZmVyYWJsZU91dHB1dCB9IGZyb20gXCIuXCJcbmltcG9ydCB7IFVUWE9TZXQgfSBmcm9tIFwiLi91dHhvc1wiXG5pbXBvcnQgeyBPdXRwdXRPd25lcnMgfSBmcm9tIFwiLi4vLi4vY29tbW9uL291dHB1dFwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgQWRkcmVzc1BhcmFtcyB7XG4gIGFkZHJlc3M6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFN0YWtlUGFyYW1zIHtcbiAgYWRkcmVzc2VzOiBzdHJpbmdbXVxuICBlbmNvZGluZzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0U3Rha2VSZXNwb25zZSB7XG4gIHN0YWtlZDogQk5cbiAgc3Rha2VkT3V0cHV0czogVHJhbnNmZXJhYmxlT3V0cHV0W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRSZXdhcmRVVFhPc1BhcmFtcyB7XG4gIHR4SUQ6IHN0cmluZ1xuICBlbmNvZGluZzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0UmV3YXJkVVRYT3NSZXNwb25zZSB7XG4gIG51bUZldGNoZWQ6IG51bWJlclxuICB1dHhvczogc3RyaW5nW11cbiAgZW5jb2Rpbmc6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFZhbGlkYXRvcnNBdFBhcmFtcyB7XG4gIGhlaWdodDogbnVtYmVyXG4gIHN1Ym5ldElEPzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0VmFsaWRhdG9yc0F0UmVzcG9uc2Uge1xuICB2YWxpZGF0b3JzOiBvYmplY3Rcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRDb25maWd1cmF0aW9uUmVzcG9uc2Uge1xuICBuZXR3b3JrSUQ6IG51bWJlclxuICBhc3NldElEOiBzdHJpbmdcbiAgYXNzZXRTeW1ib2w6IHN0cmluZ1xuICBocnA6IHN0cmluZ1xuICBibG9ja2NoYWluczogb2JqZWN0W11cbiAgbWluU3Rha2VEdXJhdGlvbjogbnVtYmVyXG4gIG1heFN0YWtlRHVyYXRpb246IG51bWJlclxuICBtaW5WYWxpZGF0b3JTdGFrZTogQk5cbiAgbWF4VmFsaWRhdG9yU3Rha2U6IEJOXG4gIG1pbkRlbGVnYXRpb25GZWU6IEJOXG4gIG1pbkRlbGVnYXRvclN0YWtlOiBCTlxuICBtaW5Db25zdW1wdGlvblJhdGU6IG51bWJlclxuICBtYXhDb25zdW1wdGlvblJhdGU6IG51bWJlclxuICBzdXBwbHlDYXA6IEJOXG4gIHZlcmlmeU5vZGVTaWduYXR1cmU6IGJvb2xlYW5cbiAgbG9ja01vZGVCb25kRGVwb3NpdDogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEN1cnJlbnRWYWxpZGF0b3JzUGFyYW1zIHtcbiAgc3VibmV0SUQ/OiBCdWZmZXIgfCBzdHJpbmdcbiAgbm9kZUlEcz86IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0QWxsRGVwb3NpdE9mZmVyc1BhcmFtcyB7XG4gIHRpbWVzdGFtcDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2FtcGxlVmFsaWRhdG9yc1BhcmFtcyB7XG4gIHNpemU6IG51bWJlciB8IHN0cmluZ1xuICBzdWJuZXRJRD86IEJ1ZmZlciB8IHN0cmluZyB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNhbXBsZVZhbGlkYXRvcnNQYXJhbXMge1xuICBzaXplOiBudW1iZXIgfCBzdHJpbmdcbiAgc3VibmV0SUQ/OiBCdWZmZXIgfCBzdHJpbmcgfCB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBZGRWYWxpZGF0b3JQYXJhbXMge1xuICB1c2VybmFtZTogc3RyaW5nXG4gIHBhc3N3b3JkOiBzdHJpbmdcbiAgbm9kZUlEOiBzdHJpbmdcbiAgc3RhcnRUaW1lOiBudW1iZXJcbiAgZW5kVGltZTogbnVtYmVyXG4gIHN0YWtlQW1vdW50OiBzdHJpbmdcbiAgcmV3YXJkQWRkcmVzczogc3RyaW5nXG4gIGRlbGVnYXRpb25GZWVSYXRlPzogc3RyaW5nIHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWRkRGVsZWdhdG9yUGFyYW1zIHtcbiAgdXNlcm5hbWU6IHN0cmluZ1xuICBwYXNzd29yZDogc3RyaW5nXG4gIG5vZGVJRDogc3RyaW5nXG4gIHN0YXJ0VGltZTogbnVtYmVyXG4gIGVuZFRpbWU6IG51bWJlclxuICBzdGFrZUFtb3VudDogc3RyaW5nXG4gIHJld2FyZEFkZHJlc3M6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFBlbmRpbmdWYWxpZGF0b3JzUGFyYW1zIHtcbiAgc3VibmV0SUQ/OiBCdWZmZXIgfCBzdHJpbmdcbiAgbm9kZUlEcz86IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0QVZBWFBhcmFtcyB7XG4gIHVzZXJuYW1lOiBzdHJpbmdcbiAgcGFzc3dvcmQ6IHN0cmluZ1xuICBhbW91bnQ6IHN0cmluZ1xuICB0bzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0QVZBWFBhcmFtcyB7XG4gIHVzZXJuYW1lOiBzdHJpbmdcbiAgcGFzc3dvcmQ6IHN0cmluZ1xuICBzb3VyY2VDaGFpbjogc3RyaW5nXG4gIHRvOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFeHBvcnRLZXlQYXJhbXMge1xuICB1c2VybmFtZTogc3RyaW5nXG4gIHBhc3N3b3JkOiBzdHJpbmdcbiAgYWRkcmVzczogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0S2V5UGFyYW1zIHtcbiAgdXNlcm5hbWU6IHN0cmluZ1xuICBwYXNzd29yZDogc3RyaW5nXG4gIHByaXZhdGVLZXk6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVUWE9JRCB7XG4gIHR4SUQ6IHN0cmluZ1xuICBvdXRwdXRJbmRleDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFsYW5jZURpY3Qge1xuICBbYXNzZXRJZDogc3RyaW5nXTogQk5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRCYWxhbmNlUmVzcG9uc2VBdmF4IHtcbiAgYmFsYW5jZTogQk5cbiAgdW5sb2NrZWQ6IEJOXG4gIGxvY2tlZFN0YWtlYWJsZTogQk5cbiAgbG9ja2VkTm90U3Rha2VhYmxlOiBCTlxuICB1dHhvSURzOiBVVFhPSURbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEJhbGFuY2VSZXNwb25zZUNhbWlubyB7XG4gIGJhbGFuY2VzOiBCYWxhbmNlRGljdFxuICB1bmxvY2tlZE91dHB1dHM6IEJhbGFuY2VEaWN0XG4gIGJvbmRlZE91dHB1dHM6IEJhbGFuY2VEaWN0XG4gIGRlcG9zaXRlZE91dHB1dHM6IEJhbGFuY2VEaWN0XG4gIGJvbmRlZERlcG9zaXRlZE91dHB1dHM6IEJhbGFuY2VEaWN0XG4gIHV0eG9JRHM6IFVUWE9JRFtdXG59XG5cbmV4cG9ydCB0eXBlIEdldEJhbGFuY2VSZXNwb25zZSA9XG4gIHwgR2V0QmFsYW5jZVJlc3BvbnNlQXZheFxuICB8IEdldEJhbGFuY2VSZXNwb25zZUNhbWlub1xuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZUFkZHJlc3NQYXJhbXMge1xuICB1c2VybmFtZTogc3RyaW5nXG4gIHBhc3N3b3JkOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaXN0QWRkcmVzc2VzUGFyYW1zIHtcbiAgdXNlcm5hbWU6IHN0cmluZ1xuICBwYXNzd29yZDogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhcnRJbmRleCB7XG4gIGFkZHJlc3M6IHN0cmluZ1xuICB1dHhvOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRVVFhPc1BhcmFtcyB7XG4gIGFkZHJlc3Nlczogc3RyaW5nW10gfCBzdHJpbmdcbiAgc291cmNlQ2hhaW4/OiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgbGltaXQ6IG51bWJlciB8IDBcbiAgc3RhcnRJbmRleD86IFN0YXJ0SW5kZXggfCB1bmRlZmluZWRcbiAgcGVyc2lzdE9wdHM/OiBQZXJzaXN0YW5jZU9wdGlvbnMgfCB1bmRlZmluZWRcbiAgZW5jb2Rpbmc/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbmRJbmRleCB7XG4gIGFkZHJlc3M6IHN0cmluZ1xuICB1dHhvOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRVVFhPc1Jlc3BvbnNlIHtcbiAgbnVtRmV0Y2hlZDogbnVtYmVyXG4gIHV0eG9zOiBVVFhPU2V0XG4gIGVuZEluZGV4OiBFbmRJbmRleFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZVN1Ym5ldFBhcmFtcyB7XG4gIHVzZXJuYW1lOiBzdHJpbmdcbiAgcGFzc3dvcmQ6IHN0cmluZ1xuICBjb250cm9sS2V5czogc3RyaW5nW11cbiAgdGhyZXNob2xkOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdWJuZXQge1xuICBpZHM6IHN0cmluZ1xuICBjb250cm9sS2V5czogc3RyaW5nW11cbiAgdGhyZXNob2xkOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVCbG9ja2NoYWluUGFyYW1zIHtcbiAgdXNlcm5hbWU6IHN0cmluZ1xuICBwYXNzd29yZDogc3RyaW5nXG4gIHN1Ym5ldElEPzogQnVmZmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkXG4gIHZtSUQ6IHN0cmluZ1xuICBmeElEczogbnVtYmVyW11cbiAgbmFtZTogc3RyaW5nXG4gIGdlbmVzaXNEYXRhOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja2NoYWluIHtcbiAgaWQ6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbiAgc3VibmV0SUQ6IHN0cmluZ1xuICB2bUlEOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRUeFN0YXR1c1BhcmFtcyB7XG4gIHR4SUQ6IHN0cmluZ1xuICBpbmNsdWRlUmVhc29uPzogYm9vbGVhbiB8IHRydWVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRUeFN0YXR1c1Jlc3BvbnNlIHtcbiAgc3RhdHVzOiBzdHJpbmdcbiAgcmVhc29uOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRNaW5TdGFrZVJlc3BvbnNlIHtcbiAgbWluVmFsaWRhdG9yU3Rha2U6IEJOXG4gIG1pbkRlbGVnYXRvclN0YWtlOiBCTlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYWltYWJsZSB7XG4gIHJld2FyZE93bmVyPzogT3duZXJcbiAgdmFsaWRhdG9yUmV3YXJkczogQk5cbiAgZXhwaXJlZERlcG9zaXRSZXdhcmRzOiBCTlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldENsYWltYWJsZXNSZXNwb25zZSB7XG4gIGNsYWltYWJsZXM6IENsYWltYWJsZVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0QWxsRGVwb3NpdE9mZmVyc1Jlc3BvbnNlIHtcbiAgZGVwb3NpdE9mZmVyczogRGVwb3NpdE9mZmVyW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBEZXBvc2l0T2ZmZXIge1xuICB1cGdyYWRlVmVyc2lvbjogbnVtYmVyXG4gIGlkOiBzdHJpbmdcbiAgaW50ZXJlc3RSYXRlTm9taW5hdG9yOiBCTlxuICBzdGFydDogQk5cbiAgZW5kOiBCTlxuICBtaW5BbW91bnQ6IEJOXG4gIHRvdGFsTWF4QW1vdW50OiBCTlxuICBkZXBvc2l0ZWRBbW91bnQ6IEJOXG4gIG1pbkR1cmF0aW9uOiBudW1iZXJcbiAgbWF4RHVyYXRpb246IG51bWJlclxuICB1bmxvY2tQZXJpb2REdXJhdGlvbjogbnVtYmVyXG4gIG5vUmV3YXJkc1BlcmlvZER1cmF0aW9uOiBudW1iZXJcbiAgbWVtbzogc3RyaW5nXG4gIGZsYWdzOiBCTlxuICB0b3RhbE1heFJld2FyZEFtb3VudDogQk5cbiAgcmV3YXJkZWRBbW91bnQ6IEJOXG4gIG93bmVyQWRkcmVzcz86IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldERlcG9zaXRzUGFyYW1zIHtcbiAgZGVwb3NpdFR4SURzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldERlcG9zaXRzUmVzcG9uc2Uge1xuICBkZXBvc2l0czogQVBJRGVwb3NpdFtdXG4gIGF2YWlsYWJsZVJld2FyZHM6IEJOW11cbiAgdGltZXN0YW1wOiBCTlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFQSURlcG9zaXQge1xuICBkZXBvc2l0VHhJRDogc3RyaW5nXG4gIGRlcG9zaXRPZmZlcklEOiBzdHJpbmdcbiAgdW5sb2NrZWRBbW91bnQ6IEJOXG4gIHVubG9ja2FibGVBbW91bnQ6IEJOXG4gIGNsYWltZWRSZXdhcmRBbW91bnQ6IEJOXG4gIHN0YXJ0OiBCTlxuICBkdXJhdGlvbjogbnVtYmVyXG4gIGFtb3VudDogQk5cbiAgcmV3YXJkT3duZXI6IE93bmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0TWF4U3Rha2VBbW91bnRQYXJhbXMge1xuICBzdWJuZXRJRD86IHN0cmluZ1xuICBub2RlSUQ6IHN0cmluZ1xuICBzdGFydFRpbWU6IHN0cmluZ1xuICBlbmRUaW1lOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPd25lciB7XG4gIGxvY2t0aW1lOiBCTlxuICB0aHJlc2hvbGQ6IG51bWJlclxuICBhZGRyZXNzZXM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3duZXJQYXJhbSB7XG4gIGxvY2t0aW1lOiBzdHJpbmdcbiAgdGhyZXNob2xkOiBudW1iZXJcbiAgYWRkcmVzc2VzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE11bHRpc2lnQWxpYXNSZXBseSBleHRlbmRzIE93bmVyIHtcbiAgbWVtbzogc3RyaW5nIC8vIGhleCBlbmNvZGVkIHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE11bHRpc2lnQWxpYXNQYXJhbXMge1xuICBpZD86IEJ1ZmZlclxuICBtZW1vOiBzdHJpbmdcbiAgb3duZXJzOiBPdXRwdXRPd25lcnNcbiAgYXV0aDogW251bWJlciwgQnVmZmVyXVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3BlbmRQYXJhbXMge1xuICBmcm9tOiBzdHJpbmdbXSB8IHN0cmluZ1xuICBzaWduZXI6IHN0cmluZ1tdIHwgc3RyaW5nXG4gIHRvPzogT3duZXJQYXJhbVxuICBjaGFuZ2U/OiBPd25lclBhcmFtXG5cbiAgbG9ja01vZGU6IDAgfCAxIHwgMlxuICBhbW91bnRUb0xvY2s6IHN0cmluZ1xuICBhbW91bnRUb0J1cm46IHN0cmluZ1xuICBhc09mOiBzdHJpbmdcbiAgZW5jb2Rpbmc/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTcGVuZFJlcGx5IHtcbiAgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdXG4gIG91dDogVHJhbnNmZXJhYmxlT3V0cHV0W11cbiAgb3duZXJzOiBPdXRwdXRPd25lcnNbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYWltQW1vdW50UGFyYW1zIHtcbiAgaWQ/OiBCdWZmZXJcbiAgY2xhaW1UeXBlOiBDbGFpbVR5cGVcbiAgYW1vdW50OiBCTlxuICBvd25lcnM6IE91dHB1dE93bmVyc1xuICBzaWdJZHhzOiBudW1iZXJbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVwZ3JhZGVQaGFzZXNSZXBseSB7XG4gIFN1bnJpc2VQaGFzZTogbnVtYmVyXG59XG4iXX0=