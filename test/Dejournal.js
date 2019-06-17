const Dejournal = artifacts.require("./Dejournal.sol");

contract("Dejournal", accounts => {
  it("should store the string 'Hey there!'", async () => {
    const Dejournal = await Dejournal.deployed();

    // Set myString to "Hey there!"
    await Dejournal.set("Hey there!", { from: accounts[0] });

    // Get myString from public variable getter
    const storedString = await Dejournal.myString.call();

    assert.equal(storedString, "Hey there!", "The string was not stored");
  });
});