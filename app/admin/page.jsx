<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full p-2.5 text-xs rounded-lg border border-stone-300 bg-white"
>
  <option value="Sarees">Sarees</option>
  <option value="Jewellery">Jewellery</option>
  <option value="Dresses">Dresses</option>
  <option value="Bags">Bags</option>
  <option value="Cosmetics">Cosmetics</option>
  <option value="Home Decor">Home Decor</option>
  <option value="Gifts">Gifts</option>
  <option value="Fancy Items">Fancy Items</option>
</select>
