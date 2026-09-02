export const hasSearchConditions = (
  condition: Record<
    string,
    string | number | boolean | (string | undefined)[] | null
  >,
): boolean => {
  return (
    Object.keys(condition).length > 0 &&
    Object.values(condition).some((value) => value !== '' && value !== null)
  );
};
