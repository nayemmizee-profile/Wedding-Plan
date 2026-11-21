const response = await fetch(`${process.env.API_URL}/admin/services${query}`, {
  method: "GET",
  headers: {
    "x-internal-secret": process.env.INTERNAL_API_SECRET,
    "x-user-id": session.user.id,
  },
  cache: "no-store",
});

const responseText = await response.text();

console.log("Express Status:", response.status);
console.log("Express Response:", responseText);

let result;

try {
  result = JSON.parse(responseText);
} catch {
  throw new Error("Express returned an invalid JSON response");
}

return NextResponse.json(result, {
  status: response.status,
});
