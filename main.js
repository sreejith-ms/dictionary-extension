$(document).ready(function() {
  $("#search").submit(function() {
    var q = escape(
      $("#q")
        .val()
        .replace(/[^a-z0-9\+\-\s]/gi, "")
        .replace(/\s+/g, " ")
    );
    if (!q) return false;

    loading(true);

    $.getJSON("https://olam.in/Dictionary/en_ml/" + q + "?json=1", function(
      data
    ) {
      loading(false);
      render(q, data);
    });
    return false;
  });

  function loading(show) {
    show ? $("#loading").show() : $("#loading").hide();
  }

  function render(q, data) {
    if (!data || data.length < 1) {
      $("#results").html(
        'നിങ്ങള്‍ അന്വേഷിച്ച "' +
          q +
          '" എന്ന പദത്തിന്റെ അര്‍ഥം കണ്ടെത്താനായില്ല. സാധ്യമെങ്കില്‍, ദയവായി <a href="http://olam.in/Add/" target="_blank">നിഘണ്ടുവില്‍ ചേര്‍ക്കുക.</a>'
      );
      return;
    }
    addToStore(q, data);
    var html = "";
    $(data).each(function() {
      html += "<li>";
      html += "<h2>" + this.word + '</h2><ul class="definitions">';

      $(this.definitions).each(function() {
        html += "<li>" + this + "</li>";
      });

      html += "</ul></li>";
    });

    $("#results").html(html);
  }

  $("#q").focus();
});

const addToStore = async (query, results) => {
  try {
    let item = {};
	const date = new Date().getTime();
	query = cleanUp(query);
    const existingItem = await browser.storage.local.get(query);
    if (
      !!existingItem &&
      Object.keys(existingItem).length &&
      existingItem[query]
    ) {
      item = existingItem;
      item[query].ts.push(date);
      item[query].occurance += 1;
    } else {
      item[query] = {
        word: query,
        definition: results,
        ts: [date],
        occurance: 1
      };
    }
    await browser.storage.local.set(item);
  } catch (error) {
    console.error("Error", error);
  }
};

const cleanUp = q => q.toLowerCase().replace("%20", "").trim();