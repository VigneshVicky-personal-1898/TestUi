package com.testui.playwright.dataproviders;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Playwright Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.testui.playwright.utils.DataReader;
import org.testng.annotations.DataProvider;

import java.util.List;
import java.util.Map;

public final class TestDataProviders {

    private TestDataProviders() {
    }

    @DataProvider(name = "loginCredentials", parallel = true)
    public static Object[][] loginCredentials() {
        List<Map<String, String>> rows = DataReader.readCsv("login-users.csv");
        Object[][] data = new Object[rows.size()][4];
        for (int i = 0; i < rows.size(); i++) {
            Map<String, String> row = rows.get(i);
            data[i][0] = row.get("email");
            data[i][1] = row.get("password");
            data[i][2] = row.get("captcha");
            data[i][3] = row.get("expected");
        }
        return data;
    }

    @DataProvider(name = "newUsers")
    public static Object[][] newUsers() {
        List<Map<String, Object>> rows = DataReader.readJsonArray("testdata/users.json");
        Object[][] data = new Object[rows.size()][4];
        for (int i = 0; i < rows.size(); i++) {
            Map<String, Object> row = rows.get(i);
            data[i][0] = String.valueOf(row.get("name"));
            data[i][1] = String.valueOf(row.get("email"));
            data[i][2] = String.valueOf(row.get("department"));
            data[i][3] = String.valueOf(row.get("phone"));
        }
        return data;
    }
}
