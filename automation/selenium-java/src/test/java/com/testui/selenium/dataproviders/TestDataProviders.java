package com.testui.selenium.dataproviders;

// AI-ASSISTED: Cursor
// PROMPT: Split login CSV into valid and invalid data providers
// ACCEPTED-BY: vignesh

import com.testui.selenium.utils.DataReader;
import org.testng.annotations.DataProvider;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Central TestNG data providers (CSV / JSON / inline).
 */
public final class TestDataProviders {

    private TestDataProviders() {
    }

    @DataProvider(name = "loginCredentials", parallel = true)
    public static Object[][] loginCredentials() {
        return mapLoginRows(DataReader.readCsv("login-users.csv"), null);
    }

    @DataProvider(name = "validLoginCredentials", parallel = true)
    public static Object[][] validLoginCredentials() {
        return mapLoginRows(DataReader.readCsv("login-users.csv"), "success");
    }

    @DataProvider(name = "invalidLoginCredentials", parallel = true)
    public static Object[][] invalidLoginCredentials() {
        return mapLoginRows(DataReader.readCsv("login-users.csv"), "failure");
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

    @DataProvider(name = "methodNameProvider")
    public static Object[][] methodNameProvider(Method method) {
        return new Object[][]{{method.getName()}};
    }

    private static Object[][] mapLoginRows(List<Map<String, String>> rows, String expectedFilter) {
        List<Object[]> filtered = new ArrayList<>();
        for (Map<String, String> row : rows) {
            String expected = row.get("expected");
            if (expectedFilter != null && !expectedFilter.equalsIgnoreCase(expected)) {
                continue;
            }
            if (expectedFilter == null) {
                filtered.add(new Object[]{
                        row.get("email"), row.get("password"), row.get("captcha"), expected
                });
            } else {
                filtered.add(new Object[]{
                        row.get("email"), row.get("password"), row.get("captcha")
                });
            }
        }
        return filtered.toArray(new Object[0][]);
    }
}
