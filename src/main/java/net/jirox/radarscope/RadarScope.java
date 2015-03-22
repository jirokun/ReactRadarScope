package net.jirox.radarscope;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

import javax.script.Bindings;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import net.jirox.radarscope.models.Category;
import net.jirox.radarscope.models.Product;

/**
 * レーダースコープのHTMLをサーバサイドでレンダリングする。
 * 
 * クライアントサイドのコードと同一にするため、
 * 
 * @author jirokun@gmail.com
 */
public class RadarScope {
	private static RadarScope instance;
	private final ScriptEngine engine = new ScriptEngineManager(null)
			.getEngineByName("nashorn");

	private RadarScope() throws ScriptException {
		engine.eval("load('./dist/scripts/jvm-npm.js');");
		prepareForReactJs(engine);
		engine.eval("var React = require('react');"
				+ "var Router = require('react-router');"
				+ "var RadarStore = require('./dist/scripts/stores/RadarStore');"
				+ "var routes = require('./dist/scripts/routes');");
	}

	/**
	 * シングルトンのRadarScopeインスタンスを取得する。
	 * 
	 * @return
	 * @throws ScriptException
	 */
	public synchronized static RadarScope getInstance() throws ScriptException {
		if (instance == null)
			instance = new RadarScope();
		return instance;
	}

	/**
	 * HTMLを取得する。
	 * 
	 * JavaScriptはシングルスレッドで実行する必要があるため、synchronizedしている。
	 * 高速化が必要であれば、engineを複数用意してThread化するべき。
	 * 
	 * @param path
	 * @param yearMonth
	 * @param productList
	 * @param categoryList
	 * @param rankingList
	 * @param rankDateList
	 * @return
	 * @throws ScriptException
	 * @throws IOException
	 */
	public synchronized String render(String path, String yearMonth,
			List<Product> productList, List<Category> categoryList,
			List<Product> rankingList, List<Long> rankDateList,
			boolean isChildCategory) throws ScriptException, IOException {
		// 使用する変数を定義
		Bindings bindings = engine.getBindings(ScriptContext.ENGINE_SCOPE);
		bindings.put("yearMonth", yearMonth);
		bindings.put("productList", productList);
		bindings.put("categoryList", categoryList);
		bindings.put("rankingList", rankingList);
		bindings.put("rankDateList", rankDateList);
		bindings.put("isChildCategory", isChildCategory);
		bindings.put("url", path);
		String server = getJavaScriptSource("./dist/scripts/server.js");
		return (String) engine.eval(server);
	}

	/**
	 * React.jsが使用する使用するグローバル変数を用意する。
	 * 
	 * React.jsはBrowserやnode.jsを実行環境として捉えているため、Nashornにはないグローバル変数を利用している。
	 * 足りないグローバル変数を定義する。
	 * 
	 * @param engine
	 * @throws ScriptException
	 */
	private void prepareForReactJs(ScriptEngine engine) throws ScriptException {
		engine.eval("var console = {warn: function() {}};");
		engine.eval("var process = {};");
		engine.eval("process.env = {};");
		engine.eval("process.env.NODE_ENV = 'production';");
	}

	/**
	 * 指定したファイルの文字列を取得する
	 * 
	 * @param path
	 * @return
	 * @throws IOException
	 * @throws UnsupportedEncodingException
	 */
	private String getJavaScriptSource(String path) throws IOException,
			UnsupportedEncodingException {
		return Files.readAllLines(new File(path).toPath()).stream()
				.collect(Collectors.joining());
	}
}
