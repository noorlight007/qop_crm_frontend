type UpdateSessionFunction = (data: any) => Promise<any>;

let updateSessionRef: UpdateSessionFunction | null = null;

export const registerUpdateSession = (updateFn: UpdateSessionFunction) => {
  updateSessionRef = updateFn;
};

export const updateSession = async (data: any) => {
  if (updateSessionRef) {
    await updateSessionRef(data);
  }
};
